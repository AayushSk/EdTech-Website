const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const { parsePagination } = require("../utils/pagination");
const { getOrSetCache, invalidateCache, invalidatePattern, CACHE_KEYS } = require("../utils/cache");


exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        const courseDetails = await Course.find({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        });

        if (!courseDetails) {
            return res.status(404).json({ success: false, emessage: "Student not enrolled in course" });
        };
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });

        if (alreadyReviewed) {
            return res.status(404).json({ success: false, message: "Already reviewed" });
        }
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        });


        await Course.findByIdAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id
                }
            });

        // Invalidate review caches and course details cache
        await invalidateCache(CACHE_KEYS.COURSE_AVG_RATING(courseId));
        await invalidatePattern("reviews:cursor:*");
        if (courseId) {
            await invalidateCache(CACHE_KEYS.COURSE_DETAILS(courseId));
        }


        res.status(200).json({
            success: true,
            message: "Rating added successfully",
            ratingReview
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}








exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.body?.courseId || req.query?.courseId;
        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required",
                averageRating: 0,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: "Invalid Course ID",
                averageRating: 0,
            });
        }

        const cacheKey = CACHE_KEYS.COURSE_AVG_RATING(courseId);

        // Cache average rating for 30 minutes (1800 seconds)
        const averageRating = await getOrSetCache(cacheKey, 1800, async () => {
            const result = await RatingAndReview.aggregate([
                {
                    $match: {
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: "$rating" },
                    },
                },
            ]);

            if (result.length > 0) {
                return result[0].averageRating;
            }
            return 0;
        });

        if (averageRating > 0) {
            return res.status(200).json({ averageRating });
        } else {
            return res.status(200).json({
                message: "Average rating is 0",
                averageRating: 0,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};









//getAllRating with cursor-based pagination and strict limit clamping
exports.getAllRating = async (req, res) => {
    try {
        const { limit } = parsePagination(req.query, 10, 10);
        const cursor = req.query.cursor; // Last seen _id from previous batch

        // Validate cursor format if provided (must be valid 24-char hex Mongo ObjectId)
        let filter = {};
        if (cursor) {
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid cursor format",
                });
            }
            filter = { _id: { $lt: new mongoose.Types.ObjectId(cursor) } };
        }

        const cacheKey = CACHE_KEYS.ALL_REVIEWS(cursor, limit);

        // Cache paginated reviews for 15 minutes (900 seconds)
        const cachedPayload = await getOrSetCache(cacheKey, 900, async () => {
            // Fetch one extra item (limit + 1) to determine if next page exists without full collection scan
            const reviews = await RatingAndReview.find(filter)
                .sort({ _id: -1 })
                .limit(limit + 1)
                .populate({
                    path: "user",
                    select: "firstName lastName email image",
                })
                .populate({
                    path: "course",
                    select: "courseName",
                })
                .exec();

            const hasNextPage = reviews.length > limit;
            const data = hasNextPage ? reviews.slice(0, limit) : reviews;
            const nextCursor = data.length > 0 ? data[data.length - 1]._id : null;

            return {
                data,
                pagination: {
                    limit: limit,
                    hasNextPage: hasNextPage,
                    nextCursor: hasNextPage ? nextCursor : null,
                },
            };
        });

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: cachedPayload.data,
            pagination: cachedPayload.pagination,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
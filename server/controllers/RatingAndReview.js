const RatingAndReview= require("../models/RatingAndReview");
const Course= require("../models/Course");

//create Rating
exports.createRating = async (req, res) => {
    try{
        //get user id
        const userId= req.user.id;
        //fetch data from req body
        const {rating,review,courseId}= req.body
        //check if user is enrolled or not
        const courseDetails= await Course.findOne(
                                                {_id:courseId,
                                                studentsEnrolled:{$elemMatch:{$eq:userId}},
    });
    if(!courseDetails)
    {
        return res.status(400).json({
            success:false,
            message:"Student is not enrolled in the course"
        })
    }
        //check if user reviewed the course
         const alreadyReviewed = await RatingAndReview.findOne({
                                                        user:userId,
                                                        course:courseId,
                                                        });
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Course already reviewed by user"
            })
        }
        //create reating and review
        const ratingReview= await RatingAndReview.create({ 
                                                        rating,review,
                                                        course:courseId,
                                                        user:userId,

                                                    })
        //update course with this rating
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push:{
                                                ratingAndReviews:ratingReview._id,
                                            }
                                        },
                                        {new:true});

        console.log(updatedCourseDetails);
        return res.status(200).json({
            success:true,
            message: 'Rating and Review created successfully',
            ratingReview,
        })
    }
    catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message: error.message,
            })
    }
}


//getAverageRating
exports.getAverageRating = async (req,res)=>{
    try{
        //get course id
        const courseId = req.body.courseId;
        //calc average rating

        const result= await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }, 
            },
            {
                $group:{
                    _id:null,
                    averageRating:{ $avg: "$rating"},
                }
            }
        ])

        //return res
        if(result.length>0){
            return res.status(200).json({
                success: true,
                averageRating:result[0].averageRating,
            })
        }
        //if no rating exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no rating given till now",
            averageRating:0,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

//getAllRating with cursor-based pagination
exports.getAllRating = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor; // Last seen _id from previous batch

        // Keyset filter: if cursor provided, fetch reviews older than this _id
        const filter = cursor ? { _id: { $lt: cursor } } : {};

        // Fetch one extra item (limit + 1) to determine if next page exists without countDocuments()
        const reviews = await RatingAndReview.find(filter)
            .sort({ _id: -1 }) // Strictly ordered by immutable _id descending
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

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: data,
            pagination: {
                limit: limit,
                hasNextPage: hasNextPage,
                nextCursor: hasNextPage ? nextCursor : null,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
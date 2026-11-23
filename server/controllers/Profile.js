const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const env = require("../config/env");
const { parsePagination } = require("../utils/pagination");
const { getOrSetCache, invalidateCache, invalidatePattern, CACHE_KEYS } = require("../utils/cache");
// Method for updating a profile
exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber="",firstName,lastName,gender="" } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update the profile fields
		userDetails.firstName = firstName || userDetails.firstName;
		userDetails.lastName = lastName || userDetails.lastName;
		profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
		profile.about = about || profile.about;
		profile.gender=gender || profile.gender;
		profile.contactNumber = contactNumber || profile.contactNumber;

		// Save the updated profile
		await profile.save();
		await userDetails.save();

		// Invalidate user profile cache
		await invalidateCache(CACHE_KEYS.USER_PROFILE(id));

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
			userDetails
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
		const id = req.user.id;
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.additionalDetails });
		// TODO: Unenroll User From All the Enrolled Courses
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });

		// Invalidate user profile and enrolled courses cache
		await invalidateCache(CACHE_KEYS.USER_PROFILE(id));
		await invalidatePattern(`user:${id}:*`);

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully",error:error.message });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const cacheKey = CACHE_KEYS.USER_PROFILE(id);

		// Cache user details for 10 minutes (600 seconds)
		const userDetails = await getOrSetCache(cacheKey, 600, async () => {
			return await User.findById(id)
				.populate("additionalDetails")
				.exec();
		});

		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getEnrolledCourses = async (req, res) => {
	try {
        const id = req.user.id;
        const page = req.query.page || null;
        const limit = req.query.limit || null;
        const cacheKey = CACHE_KEYS.USER_ENROLLED_COURSES(id, page, limit);

        // Cache enrolled courses for 5 minutes (300 seconds)
        const cachedPayload = await getOrSetCache(cacheKey, 300, async () => {
            const user = await User.findById(id);
            if (!user) {
                return null;
            }
            const enrolledCourses = await User.findById(id)
                .populate({
                    path: "courses",
                    populate: {
                        path: "courseContent",
                    },
                })
                .populate("courseProgress")
                .exec();

            const enrolledCoursesData = enrolledCourses.toObject();

            // Compute progress percentage for all enrolled courses
            const allMappedCourses = (enrolledCoursesData.courses || []).map((course) => {
                const progress = enrolledCoursesData.courseProgress.find(
                    (courseProgress) => courseProgress && String(courseProgress.courseID) === String(course._id),
                );
                const totalLectures = (course.courseContent || []).reduce(
                    (total, section) => total + (section?.subSection?.length || 0),
                    0,
                );
                const completedLectures = Math.min(progress?.completedVideos?.length || 0, totalLectures);
                const completionPercentage = totalLectures
                    ? Math.round((completedLectures / totalLectures) * 100)
                    : progress?.completionPercentage || 0;

                return { ...course, progressPercentage: completionPercentage };
            });

            // Apply pagination to enrolled courses if requested, strictly clamping limit to max 10
            let paginatedCourses = allMappedCourses;
            let paginationMeta = null;

            if (req.query.page || req.query.limit) {
                const { page: parsedPage, limit: parsedLimit, skip } = parsePagination(req.query, 10, 10);
                const totalCourses = allMappedCourses.length;
                const totalPages = Math.ceil(totalCourses / parsedLimit);

                paginatedCourses = allMappedCourses.slice(skip, skip + parsedLimit);
                paginationMeta = {
                    currentPage: parsedPage,
                    totalPages: totalPages,
                    totalCourses: totalCourses,
                    limit: parsedLimit,
                    hasNextPage: parsedPage < totalPages,
                    hasPrevPage: parsedPage > 1,
                };
            }

            enrolledCoursesData.courses = paginatedCourses;

            return {
                enrolledCoursesData,
                paginationMeta,
            };
        });

        if (!cachedPayload) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: cachedPayload.enrolledCoursesData?.courses || cachedPayload.enrolledCoursesData,
            ...(cachedPayload.paginationMeta && { pagination: cachedPayload.paginationMeta }),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
	try {

		const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	const Image = req.files.displayPicture;
	if (!Image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		Image,
		env.CLOUDINARY.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

	// Invalidate user profile cache
	await invalidateCache(CACHE_KEYS.USER_PROFILE(id));

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
	}



}

// instructor dashboard
exports.instructorDashboard = async (req, res) => {
	try {
		const id = req.user.id;
		const cacheKey = CACHE_KEYS.INSTRUCTOR_DASHBOARD(id);

		// Cache instructor dashboard stats for 10 minutes (600 seconds)
		const courseDetails = await getOrSetCache(cacheKey, 600, async () => {
			const courseData = await Course.find({ instructor: id });
			return courseData.map((course) => {
				const totalStudents = course?.studentsEnrolled?.length || 0;
				const totalRevenue = (course?.price || 0) * totalStudents;
				return {
					_id: course._id,
					courseName: course.courseName,
					courseDescription: course.courseDescription,
					totalStudents,
					totalRevenue,
				};
			});
		});

		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}
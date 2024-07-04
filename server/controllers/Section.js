const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
    try {
        // Data fetch
        const {sectionName, courseId} = req.body;
        // data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required Properties",
            });
        }
        // create section
        const newSection = await Section.create({sectionName});
        // update course with section objectID
        //TODO HW: Use populate to replace sections/sub-sections both in the updatedCourseDetails
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                            {
                                                                $push:{
                                                                    courseContent:newSection._id,
                                                                }
                                                            },
                                                            {new: true},)
                                                            .populate({
                                                                path: "courseContent",
                                                                populate: {
                                                                    path: "subSection",
                                                                },
                                                            })
                                                            .exec();
        // return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section, please try again",
            error:error.message,
        });
    }
}

exports.updateSection = async (req, res) => {
    try {
        // data input 
        const {sectionName, sectionId, courseId} = req.body;
        // data validation
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }
        // update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true}); 

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: {section, course},
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error:error.message,
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        // get ID -> assuming that we are sending ID in params
        const {sectionId, courseId} = req.params;

        // TODO: Do we need to delete the entry from the course schema ??
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        });

        const section = await Section.findById(sectionId);
        if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

        //delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: course,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error:error.message,
        });
    }
}
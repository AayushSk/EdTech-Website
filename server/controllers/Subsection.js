const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create subsection
exports.createSubSection = async (req, res) => {
    try {
        // fetch data from req body
        const {sectionId, title, timeDuration, description} = req.body;
        // Extract file/video
        const video = req.files.videoFile;
        // validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // Upload video on cloudinary
        const uploadDetails =  await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // Create a sub-section
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        // Update section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                             {
                                                                $push:{
                                                                    subSection:subSectionDetails._id,
                                                                }
                                                             },{new:true})
                                                             .populate("subSection");
        // Todo: log updated section here, after adding populate query
        console.log("The updated section is: ", updatedSection);
        // Return response
        return res.status(200).json({
            succcess: true,
            message: "Sub-section created successfully",
            data: updatedSection,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        }); 
    }
}

// TODO: Update sub-section
exports.updateSubSection = async (req, res) => {
    try {
        // fetch data
        const {title, timeDuration, description, subSectionId, sectionId} = req.body;

        // validation
        if(!title || !timeDuration || !description || !video || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties",
            });
        }

        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
          return res.status(404).json({
            success: false,
            message: "SubSection not found",
          });
        }

        // update data
        // const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, {
        //                                                         title,
        //                                                         timeDuration,
        //                                                         description,
        //                                                         video,
        //                                                     }, {new: true}); 
        if (title !== undefined) {
            subSection.title = title
        }
      
        if (description !== undefined) {
            subSection.description = description
        }
        
        if (timeDuration !== undefined) {
            subSection.timeDuration = timeDuration
        }

        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
      
        await subSection.save()
      
        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )
      
        console.log("updated section", updatedSection);

        // return response
        return res.status(200).json({
            success: true,
            message: "Sub-Section updated successfully",
            data: updatedSection,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update sub-section, please try again",
            error:error.message,
        });
    }
}

// TODO: Delete sub-section
exports.deleteSubSection = async (req, res) => {
    try {
        // get ID -> assuming that we are sending ID in params
        const {subSectionId, sectionId} = req.params;

        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )

        // use findByIdAndDelete
        const subSection = await SubSection.findByIdAndDelete(subSectionId);

        if (!subSection) {
            return res
              .status(404)
              .json({ success: false, message: "SubSection not found" })
          }
      
          // find updated section and return it
          const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
          )

        // TODO: Do we need to delete the entry from the course schema ??

        // return response
        return res.status(200).json({
            success: true,
            message: "Sub-Section deleted successfully",
            data: updatedSection,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete sub-section, please try again",
            error:error.message,
        });
    }
}
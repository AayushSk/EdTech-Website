const RatingAndReview=require("../models/RatingAndReview")
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const { parsePagination } = require("../utils/pagination");


exports.createRating = async (req,res)=>{
  try {
    const userId=req.user.id;
    const {rating, review,courseId} = req.body;
    const courseDetails= await Course.find({_id: courseId,
     studentsEnrolled: {$elemMatch:{$eq:userId}}});
 
     if(!courseDetails){
         return res.status(404).json({success:false,emessage: "Student not enrolled in course"});
     };
     const alreadyReviewed =await RatingAndReview.findOne({user:userId,
     course:courseId});
 
     if(alreadyReviewed){
         return res.status(404).json({success: false,message: "Already reviewed"});
     }
     const ratingReview= await RatingAndReview.create({rating,
         review,
         course:courseId,
         user:userId});
 
 
         await Course.findByIdAndUpdate({_id:courseId},
             {
             $push:{
             ratingAndReviews: ratingReview._id
         }});
 
 
     res.status(200).json({
        success: true,
        message: "Rating added successfully",
        ratingReview});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message}); 
  }
}








exports.getAverageRating = async (res,req)=>{
    try {
        const courseId=req.body.courseId;
        const result= await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg:"$rating"}
                }
            }
        ]);

        if(result.length > 0) {
            return res.status(200).json({averageRating: result[0].averageRating});
        }
        else{
            return res.status(200).json({message: "Average rating is 0",
        averageRating:0});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
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

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: data,
            pagination: {
                limit: limit,
                hasNextPage: hasNextPage,
                nextCursor: hasNextPage ? nextCursor : null,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
const {instance} = require("../config/razorpay");
const Course= require("../models/Course");
const User= require("../models/User");
const mailSender= require("../utils/mailSender");
require("dotenv").config();

//capture payment and initiate the Razorpay order
exports.capturePayment = async (req,res)=>{
    //get courseId and userId
    const {course_id}=req.body;
    const userId=req.user.id;
    //validation
    
    //valid courseId 
    if(!course_id)
    {
        return res.json({
            success: false,
            message:"Please valide course Id"
        })
    }
    //valid courseDetails
    let course;
    try{
        course= await Course.findById(course_id);
        if(!course)
        {
            return res.json({
                success: false,
                message:"could not find course"
            })
        }
        //user already pay for the same course
        const uid=new moongoose.Types.ObjectId(userId); //userId was string and in course it is as object
        if(course.studentsEnrolled.includes(uid))
        {
            return res.status(200).json({
                success: true,
                message:"Student is already enrolled"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message
        })
    }
    //order create
    const amount=course.price;
    const currency="INR";

    const options={
        amount: amount*100,
        currency,
        receipt: Math.round(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        //initialize payment
        const paymentResponse= await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        })
    }
    catch(error){
        console.log(error);
        res.json({
            success: false,
            message:"Could not initiate order",
        })

    }
    //return response
    
}

//verify signature
exports.verifySignature = async (req, res) => {
    const webhookSecret= "123456789";

    const signature= req.headers("x-razorpay-signature");

    const shasum=crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest= shasum.digest("hex");

    if(signature===digest) {
        console.log("Payment is Authorized");
        
        const {courseId, userId}= req.body.payload.payment.entity.notes;
        try{
            //fulfil action

            //find course and enroll student in it
            const enrolledCourse= await Course.findOneByIdAndUpdate(
                                                                {_id:courseId},
                                                                {$push:{studentsEnrolled:userId}},
                                                                {new:true});
            if(!enrolledCourse)
            {
                return res.status(500).json({
                    success: false,
                    message:"Course not found"
                })
            }
            console.log(enrolledCourse);
            //find students and enroll student in list of courses
            const enrolledStudent= await User.findOneAndUpdate(
                                                                {_id:userId},
                                                                {$push:{courses:courseId}},
                                                                {new:true});
            if(!enrolledStudent)
            {
                return res.status(500).json({
                    success: false,
                    message:"Student not found"
                })
            }
            console.log(enrolledStudent);

            //mail send
            const emailResponse = await mailSender(
                                       enrolledStudent.email,
                                       "Congratulations, you are onboard" ,
                                       "Welcome to the Course"
            );
            console.log(emailResponse);

            return res.status(200).json({
                success: true,
                message:"Signature Verified and Course Added"
            })
            
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message:error.message
            });
        }
    }
    else {
        return res.status(400).json({
            success: false,
            message:"Invalid request" 
        })
    }
}



//send email

exports.sendPaymentSuccessEmail = async (req, res) => {
    const {amount,paymentId,orderId} = req.body;
    const userId = req.user.id;
    if(!amount || !paymentId) {
        return res.status(400).json({
            success:false,
            message:'Please provide valid payment details',
        });
    }
    try{
        const enrolledStudent =  await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Study Notion Payment successful`,
            "congratulation you are registered",
        );
}
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}




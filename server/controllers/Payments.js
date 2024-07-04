const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
const mongoose = require("mongoose");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    try {
        // get courseId and UserID
        const { courses } = req.body;
        const userId = req.user.id;
        // validation
        // valid courseID
        if(!courses) {
            return res.json({
                success: false,
                message: "Please provide valid course ID",
            });
        }

        let total_amount = 0;

        // valid courseDetail
        for(const course_id of courses) {
          let course;
          try {
              course = await Course.findById(course_id);

              // If the course is not found
              if(!course) {
                  return res.status(200).json({
                      success: false,
                      message: "Could not find the course",
                  });
              }
  
              // User already pay for the same course
              const uid = new mongoose.Types.ObjectId(userId);
              if(course.studentsEnrolled.includes(uid)) {
                  return res.status(200).json({
                      success: false,
                      message: "Student is already enrolled in the course",
                  });
              }

              // Add the price of the course to the total amount
              total_amount += course.price;
          }
          catch(error) {
              console.log(error);
              return res.status(500).json({
                  success: false,
                  message: error.message,
              });
          }
        }

        const options = {
            amount: total_amount*100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId: courses,
                userId,
            }
        };

        try {
            // initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            // return response
            return res.status(200).json({
                success: true,
                data: paymentResponse,
            });
        }
        catch(error) {
            console.log(error);
            return res.json({
                success: false,
                message: "Could not initiate order",
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// verify signature
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is authorized");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try {
            // fulfill the action
            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                                            {_id: courseId},
                                                            {$push:{studentsEnrolled: userId}},
                                                            {new:true},            
                                                            );
            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                });
            }

            console.log(enrolledCourse);

            // find the student and add the course to their list enrolled courses me
            const enrolledStudent = await User.findOneAndUpdate(
                                                        {_id:userId},
                                                        {$push: {courses:courseId}},
                                                         {new:true},
            );
            console.log(enrolledStudent); 
            
            // mail send krdo confirmation wala
            const emailResponse = await mailSender(
                                            enrolledStudent.email,
                                            "Congratulations from StudyNotion",
                                            "congratulations, you are onboarded into new StudyNotion Course",
            );

            console.log(emailResponse);

            return res.status(200).json({
                success: true,
                message: "Signature verified and course were added to the student portal",
            });
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid signature",
        });
    }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all the details" 
      });
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } 
    catch (error) {
      console.log("error in sending mail", error)
      return res.status(400).json({ 
        success: false, 
        message: "Could not send email" 
      });
    }
}
  
  // enroll the student in the courses
exports.enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Please Provide Course ID and User ID" 
      });
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res.status(500).json({ 
            success: false, 
            error: "Course not found" 
          });
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } 
      catch (error) {
        console.log(error)
        return res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      }
    }
  }
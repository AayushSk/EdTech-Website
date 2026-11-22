const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const PaymentRecord = require("../models/PaymentRecord");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccess} = require("../mail/templates/paymentSuccess");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const env = require("../config/env");
const { publishEvent } = require("../config/kafkaProducer");
const { invalidateCache, invalidatePattern, CACHE_KEYS } = require("../utils/cache");

exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    const {courses} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    try{
    if(courses.length === 0) {
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    };

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        // console.log("courseid=",course_id);
        try{
            course = await Course.findById(course_id);
            if(!course) {
                return res.json({
                    success:false,
                    message:'Could not find the course',
                });
            }
    
            //user already pay for the same course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success:false,
                    message:'Student is already enrolled',
                });
            }
            totalAmount += course.price;
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
        // totalAmount += course.price;
    }
        // Generate deterministic receipt hash (Idempotency Key for order creation)
        const sortedCourseIds = [...courses].sort().join("_");
        const idempotencySeed = `${userId}_${sortedCourseIds}`;
        const deterministicReceipt = `rcpt_${crypto.createHash("sha256").update(idempotencySeed).digest("hex").slice(0, 30)}`;

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: deterministicReceipt,
        };

        try{
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log("payment",paymentResponse);
            //return response
            return res.status(200).json({
                success:true,
                orderId: paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            });
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    
};



    // Verify Razorpay signature and fulfill enrollment idempotently
exports.verifySignature = async (req, res) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, courses } = req.body;
        const userId = req.user.id;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment details are incomplete',
            });
        }

        // 1. Idempotency Check: verify if this paymentId was already completed
        const existingRecord = await PaymentRecord.findOne({ paymentId: razorpay_payment_id });
        if (existingRecord) {
            console.log(`[Idempotency Guard] Payment ${razorpay_payment_id} was already fulfilled. Returning cached 200.`);
            return res.status(200).json({
                success: true,
                message: 'Payment already verified and processed',
                idempotent: true,
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Verify cryptographic signature from Razorpay
        const generatedSignature = crypto
            .createHmac("sha256", env.RAZORPAY.SECRET)
            .update(body.toString())
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: invalid signature',
            });
        }

        const enrolleStudent = async (courses, userId) => {
            if (!courses || !userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide valid courses and user ID',
                });
            }

            try {
                for (const course_id of courses) {
                    console.log("Fulfilling course enrollment:", course_id);

                    // 1. Use $addToSet instead of $push to guarantee array uniqueness
                    const course = await Course.findByIdAndUpdate(
                        course_id,
                        { $addToSet: { studentsEnrolled: userId } },
                        { new: true }
                    );

                    // 2. Add course to user without duplicates
                    await User.updateOne(
                        { _id: userId },
                        { $addToSet: { courses: course_id } }
                    );

                    // 3. Check if CourseProgress document already exists before creating a new one
                    let existingProgress = await CourseProgress.findOne({
                        userID: userId,
                        courseID: course_id,
                    });

                    if (!existingProgress) {
                        const newCourseProgress = new CourseProgress({
                            userID: userId,
                            courseID: course_id,
                            completedVideos: [],
                        });
                        await newCourseProgress.save();

                        await User.findByIdAndUpdate(
                            userId,
                            { $addToSet: { courseProgress: newCourseProgress._id } }
                        );
                    }

                    // 4. Send email notification (Kafka event with fallback)
                    const recipient = await User.findById(userId);
                    const courseName = course?.courseName || "your course";
                    const courseDescription = course?.courseDescription || "";
                    const thumbnail = course?.thumbnail || "";
                    const userEmail = recipient?.email;
                    const userName = `${recipient?.firstName || ""} ${recipient?.lastName || ""}`.trim();
                    const emailTemplate = courseEnrollmentEmail(courseName, userName, courseDescription, thumbnail);

                    const eventSent = await publishEvent("notifications.email", userEmail, {
                        eventType: "COURSE_ENROLLMENT_CONFIRMED",
                        recipient: userEmail,
                        subject: `You have successfully enrolled for ${courseName}`,
                        html: emailTemplate,
                        metadata: { courseId: course._id, userId, paymentId: razorpay_payment_id },
                    });

                    if (!eventSent) {
                        await mailSender(
                            userEmail,
                            `You have successfully enrolled for ${courseName}`,
                            emailTemplate,
                        );
                    }

                    // Invalidate course details and instructor dashboard
                    await invalidateCache(CACHE_KEYS.COURSE_DETAILS(course_id));
                    if (course?.instructor) {
                        await invalidateCache(CACHE_KEYS.INSTRUCTOR_DASHBOARD(course.instructor));
                    }
                }

                // Invalidate student's enrolled courses cache
                await invalidatePattern(`user:${userId}:enrolled_courses:*`);

                // 5. Store payment record to lock idempotency anchor
                await PaymentRecord.create({
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    userId: userId,
                    courses: courses,
                    amount: req.body.amount || 0,
                    status: "SUCCESS",
                });

                return res.status(200).json({
                    success: true,
                    message: 'Payment verified and courses enrolled successfully',
                });
            } catch (error) {
                console.error("Error during enrollment execution:", error);
                return res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        };

        try {
            await enrolleStudent(courses, userId);
        } catch (error) {
            console.error("Signature verification error:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
};




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
        const receiptHtml = paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName);

        // 1. Publish payment receipt event to Kafka
        const eventSent = await publishEvent("notifications.email", enrolledStudent.email, {
            eventType: "PAYMENT_SUCCESS_RECEIPT",
            recipient: enrolledStudent.email,
            subject: "Study Notion Payment successful",
            html: receiptHtml,
            metadata: { amount: amount / 100, paymentId, orderId },
        });

        // 2. Fallback if Kafka unconfigured
        if (!eventSent) {
            console.log("[sendPaymentSuccessEmail] Falling back to direct mailSender...");
            await mailSender(
                enrolledStudent.email,
                `Study Notion Payment successful`,
                receiptHtml,
            );
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}























//capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
    
//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
    

// };

// //verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student andadd the course to their list enrolled courses me 
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala 
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from CodeHelp",
//                                         "Congratulations, you are onboarded into new CodeHelp Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });


//         }       
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }


// };
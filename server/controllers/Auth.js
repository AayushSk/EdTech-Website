const User = require('../models/User');
const Profile = require('../models/Profile');
const OTP = require('../models/OTP');
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// sendOTP controller
exports.sendOTP = async (req, res) => {
    try{
        // fetch email from request ki body
        const {email} = req.body;

        // Check if user already exist
        const checkUserPresent = await User.findOne({email});

        // If user already exist, then return a response
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:"User already registered, please signup with a different email",               
            })
        }

        // Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp);

        // Check unique otp or not
        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // Create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);

        // Return successful response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in sending OTP, Error: " + error.message,
        });
    }
};

// SignUp controller
exports.signUp = async (req, res) => {
    try {
        // Data fetch from request ki body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        // Validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !accountType) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please filled all required fields",
            })
        }

        // 2 password match krlo
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword value does not match, please try again",
            });
        }

        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered, please signup with a different email",
            });
        }

        // find more recent OTP stored for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // Validate OTP
        if(recentOtp.length == 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: 'OTP not found',
            });
        } else if(otp !== recentOtp.otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP, please try again',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // return response
        return res.status(200).json({
            success: true,
            message:"User is registered successfully",
            user,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again",
        })
    }
}

// Login controller
exports.login = async (req, res) => {
    try {
        // Get data from req body
        const {email, password} = req.body;

        // Validate Data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please filled all the fields",
            });
        }

        // Check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }

        // Generate JWT token, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            })
            // Means we insert token in user
            user.token = token;
            user.password = undefined;

            // Create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message:'User Logged in successfully',
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        };
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, please try again",
        })
    }
};

//TODO: Change password controller
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get oldPassword, newPassword, confirmPassword
        const { newPassword, oldPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password); 

        if(!isPasswordMatch) {
            // If old password does not match
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            })
        }

        // Update password in DB
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id, 
            {
                password: encryptedPassword,
            },
            {new: true});

        // Send mail - Password updated
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse.response);
        }
        catch(error) {
            // If there's an error sending the email
            return res.status(500).json({
                success: false,
                message: "Error occured while sending the email",
                error: error.message, 
            });
        }
        // return response
        return res.status(200).json({
            success: true,
            message: "Your password has been successfully updated",
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the password, please try later",
            error: error.message,
        });
    }
}
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const env = require("../config/env");
const { publishEvent } = require("../config/kafkaProducer");

exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");
		const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				resetPasswordTokenHash: tokenHash,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `${env.FRONTEND_URL}/login/update-password/${token}`;
		const emailBody = `Your Link for email verification is ${url}. Please click this url to reset your password.`;

		// 1. Try publishing event to Kafka
		const eventPublished = await publishEvent("notifications.email", email, {
			eventType: "USER_PASSWORD_RESET_LINK",
			recipient: email,
			subject: "Password Reset",
			html: emailBody,
			metadata: { userId: updatedDetails._id },
		});

		// 2. Fallback to direct sending if Kafka unavailable
		if (!eventPublished) {
			console.log("[ResetPassword] Falling back to direct mailSender...");
			await mailSender(email, "Password Reset", emailBody);
		}

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
		const userDetails = await User.findOne({ resetPasswordTokenHash: tokenHash });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findByIdAndUpdate(
			userDetails._id,
			{
				$set: { password: encryptedPassword },
				$unset: { resetPasswordTokenHash: 1, resetPasswordExpires: 1 },
			},
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};

const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const User = require("../models/User");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const mailSender = require("../utils/mailSender");
const { publishEvent } = require("../config/kafkaProducer");

exports.sendotp = async (req, res) => {
	const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Email is required.",
		});
	}

	let otpRecord;
	try {
		const existingUser = await User.findOne({ email }).select("_id");
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User is already registered.",
			});
		}

		let otp;
		for (let attempt = 0; attempt < 10; attempt += 1) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});
			if (!(await OTP.exists({ otp }))) {
				break;
			}
			otp = null;
		}

		if (!otp) {
			throw new Error("Could not generate a unique OTP.");
		}

		otpRecord = await OTP.create({ email, otp });
		const html = emailTemplate(otp);
		const eventPublished = await publishEvent("notifications.email", email, {
			eventType: "USER_SEND_OTP",
			recipient: email,
			subject: "Verification Email - StudyNotion",
			html,
			metadata: { otp },
		});

		if (!eventPublished) {
			console.log("[OTP Controller] Falling back to direct mailSender...");
			const mailResult = await mailSender(email, "Verification Email", html);
			if (mailResult instanceof Error) {
				throw mailResult;
			}
		}

		return res.status(200).json({
			success: true,
			message: eventPublished ? "OTP queued for delivery." : "OTP sent successfully.",
		});
	} catch (error) {
		if (otpRecord) {
			try {
				await OTP.deleteOne({ _id: otpRecord._id });
			} catch (cleanupError) {
				console.error("[OTP Controller] Could not remove undelivered OTP:", cleanupError.message);
			}
		}
		console.error("[OTP Controller] Failed to send OTP:", error.message);
		return res.status(500).json({
			success: false,
			message: "Could not send OTP. Please try again.",
		});
	}
};

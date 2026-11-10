const mailSender = require("../utils/mailSender");
const env = require("../config/env");

exports.contactUs = async (req, res) => {
    const { firstName, lastName, email, message, phoneNo } = req.body;
    if (!firstName || !email || !message) {
        return res.status(403).send({
            success: false,
            message: "All Fields are required",
        });
    }
    try {
        const data = {
            firstName,
            lastName: `${lastName ? lastName : "null"}`,
            email,
            message,
            phoneNo: `${phoneNo ? phoneNo : "null"}`,
        };
        const info = await mailSender(
            env.CONTACT_EMAIL,
            "Enquiry Received",
            `<html><body>${Object.keys(data)
                .map((key) => `<p>${key} : ${data[key]}</p>`)
                .join("")}</body></html>`
        );
        if (info) {
            return res.status(200).send({
                success: true,
                message: "Your message has been sent successfully",
            });
        } else {
            return res.status(500).send({
                success: false,
                message: "Failed to send message",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};

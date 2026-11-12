const mailSender = require("../utils/mailSender");
const env = require("../config/env");
const { publishEvent } = require("../config/kafkaProducer");

function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);
}

exports.contactUs = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        message,
        countryCode = "",
        phoneNo = "",
    } = req.body;
    if (!firstName || !email || !message || !phoneNo) {
        return res.status(403).send({
            success: false,
            message: "First name, email, phone number, and message are required.",
        });
    }

    if (!env.CONTACT_EMAIL) {
        return res.status(503).send({
            success: false,
            message: "Contact email is not configured.",
        });
    }

    try {
        const data = {
            firstName,
            lastName: lastName || "",
            email,
            message,
            phoneNo: `${countryCode} ${phoneNo}`.trim(),
        };

        const htmlBody = `<html><body>${Object.keys(data)
            .map((key) => `<p>${key} : ${escapeHtml(data[key])}</p>`)
            .join("")}</body></html>`;

        const eventPublished = await publishEvent("notifications.email", email, {
            eventType: "CONTACT_US_ENQUIRY",
            recipient: env.CONTACT_EMAIL,
            subject: "Enquiry Received",
            html: htmlBody,
            metadata: data,
        });

        if (!eventPublished) {
            console.log("[ContactUs] Falling back to direct mailSender...");
            const result = await mailSender(env.CONTACT_EMAIL, "Enquiry Received", htmlBody);
            if (result instanceof Error) {
                throw result;
            }
        }

        return res.status(200).send({
            success: true,
            message: eventPublished
                ? "Your message has been queued for delivery."
                : "Your message has been sent successfully.",
        });
    } catch (error) {
        console.error("[ContactUs] Failed to deliver enquiry:", error.message);
        return res.status(500).send({
            success: false,
            message: "We could not send your message. Please try again.",
        });
    }
};

exports.saveGetInTouch = async (req, res) => {
    const { firstName, lastName = "", email, countryCode = "", phoneNo, message } = req.body;
    if (!firstName || !email || !phoneNo || !message) {
        return res.status(400).send({
            success: false,
            message: "First name, email, phone number, and message are required.",
        });
    }

    if (!env.GOOGLE_SHEETS_WEB_APP_URL || !env.GOOGLE_SHEETS_SHARED_SECRET) {
        return res.status(503).send({
            success: false,
            message: "The Get in Touch form is not configured yet.",
        });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(env.GOOGLE_SHEETS_WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                countryCode,
                phoneNo,
                message,
                token: env.GOOGLE_SHEETS_SHARED_SECRET,
            }),
            signal: controller.signal,
        });
        const responseText = await response.text();

        if (!response.ok) {
            console.error(`[GetInTouch] Apps Script returned HTTP ${response.status}.`);
            return res.status(502).send({
                success: false,
                message: "We could not save your message. Please try again.",
            });
        }

        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            console.error("[GetInTouch] Apps Script returned an invalid response.");
            return res.status(502).send({
                success: false,
                message: "We could not confirm that your message was saved.",
            });
        }

        if (result.success !== true) {
            console.error("[GetInTouch] Apps Script reported that it could not save the submission.");
            return res.status(502).send({
                success: false,
                message: "We could not save your message. Please try again.",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Your message was saved successfully.",
        });
    } catch (error) {
        console.error("[GetInTouch] Failed to save submission:", error.message);
        return res.status(502).send({
            success: false,
            message: "We could not save your message. Please try again.",
        });
    } finally {
        clearTimeout(timeout);
    }
};

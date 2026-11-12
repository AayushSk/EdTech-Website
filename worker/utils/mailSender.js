const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: env.MAIL.HOST,
            port: 587,
            secure: false,
            auth: {
                user: env.MAIL.USER,
                pass: env.MAIL.PASS,
            },
        });
    }
    return transporter;
}

async function sendMail(to, subject, html) {
    const client = getTransporter();
    const info = await client.sendMail({
        from: `"Study Notion" <${env.MAIL.USER}>`,
        to: `${to}`,
        subject: `${subject}`,
        html: `${html}`,
    });
    return info;
}

module.exports = {
    sendMail,
};


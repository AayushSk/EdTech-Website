const nodemailer = require("nodemailer");
const env = require("../config/env");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: env.MAIL.HOST,
            port: 587,
            auth: {
                user: env.MAIL.USER,
                pass: env.MAIL.PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `"Study Notion" <${env.MAIL.USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info;
    } catch (error) {
        console.log(error.message);
        return error;
    }
};

module.exports = mailSender;

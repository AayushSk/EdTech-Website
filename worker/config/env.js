const path = require("path");
const dotenv = require("dotenv");

// Load worker environment
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

module.exports = {
    KAFKA: {
        BOOTSTRAP_SERVER: process.env.CONFLUENT_BOOTSTRAP_SERVER || "",
        API_KEY: process.env.CONFLUENT_API_KEY || "",
        API_SECRET: process.env.CONFLUENT_API_SECRET || "",
        GROUP_ID: process.env.KAFKA_GROUP_ID || "edtech-email-workers",
    },
    MAIL: {
        HOST: process.env.MAIL_HOST || "smtp.gmail.com",
        USER: process.env.MAIL_USER || "",
        PASS: process.env.MAIL_PASS || "",
    },
};

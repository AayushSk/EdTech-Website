const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env once
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const allowedOrigins = process.env.CORS_ORIGIN
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const demoUsers = (process.env.DEMO_USERS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

module.exports = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    GOOGLE_SHEETS_WEB_APP_URL: process.env.GOOGLE_SHEETS_WEB_APP_URL,
    GOOGLE_SHEETS_SHARED_SECRET: process.env.GOOGLE_SHEETS_SHARED_SECRET,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    DEMO_USERS: demoUsers,
    CORS_ORIGIN: allowedOrigins,
    KAFKA: {
        REST_ENDPOINT: process.env.CONFLUENT_REST_ENDPOINT || "",
        CLUSTER_ID: process.env.CONFLUENT_CLUSTER_ID || "",
        BOOTSTRAP_SERVER: process.env.CONFLUENT_BOOTSTRAP_SERVER || "",
        API_KEY: process.env.CONFLUENT_API_KEY || "",
        API_SECRET: process.env.CONFLUENT_API_SECRET || "",
    },
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUD_NAME,
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET,
        FOLDER_NAME: process.env.FOLDER_NAME,
    },
    RAZORPAY: {
        KEY: process.env.RAZORPAY_KEY,
        SECRET: process.env.RAZORPAY_SECRET,
    },
    MAIL: {
        HOST: process.env.MAIL_HOST,
        USER: process.env.MAIL_USER,
        PASS: process.env.MAIL_PASS,
    },
};

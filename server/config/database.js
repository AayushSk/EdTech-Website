const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("DATABASE_URL is not set in environment variables. Please check your .env file.");
        return;
    }
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("DB Connected Successfully"))
        .catch((error) => {
            console.log("DB Connection Failed");
            console.error(error.message);
        });
};
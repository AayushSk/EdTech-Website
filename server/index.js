// Compatibility polyfill for Node.js >= 22 (where SlowBuffer was removed)
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer;
}

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const app = express();

const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const paymentRoutes = require('./routes/Payments');
const courseRoutes = require('./routes/Course');

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudnairyconnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const PORT = process.env.PORT || 4000;

//database configuration 
database.connect();

//middleware configuration
app.use(express.json());
app.use(cookieParser());

//frontend linking
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp',
    })
);

//cloudinary connection
cloudnairyconnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

//def route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running....."
    });
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`app running at ${PORT}`);
    });
}

module.exports = app;

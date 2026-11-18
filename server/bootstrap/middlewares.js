const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const env = require('../config/env');
const sanitizeInput = require('../middlewares/sanitize');
const { globalLimiter } = require('../middlewares/rateLimiter');

function initMiddlewares(app) {
    // 1. Trust proxy for Vercel, Cloudflare, and load balancers to correctly identify client IPs
    app.set('trust proxy', 1);

    // 2. Global baseline rate limiter (100 reqs / 15 mins)
    app.use(globalLimiter);

    // 3. Body parsers with limits
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // 4. Security: sanitize all incoming request bodies, queries, and params
    app.use(sanitizeInput);

    // 5. CORS policy
    app.use(
        cors({
            origin: function (origin, callback) {
                if (!origin || env.CORS_ORIGIN.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
        })
    );

    // 6. File upload handler
    app.use(
        fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp',
        })
    );
}

module.exports = initMiddlewares;

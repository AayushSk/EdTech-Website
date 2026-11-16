const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const env = require('../config/env');
const sanitizeInput = require('../middlewares/sanitize');

function initMiddlewares(app) {
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Security: sanitize all incoming request bodies, queries, and params
    app.use(sanitizeInput);

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

    app.use(
        fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp',
        })
    );
}

module.exports = initMiddlewares;

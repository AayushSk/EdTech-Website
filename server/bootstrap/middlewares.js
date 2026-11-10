const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const env = require('../config/env');

function initMiddlewares(app) {
    app.use(express.json());
    app.use(cookieParser());

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


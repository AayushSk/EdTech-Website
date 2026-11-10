// 1. Polyfills & Environment Configuration
require('./bootstrap/polyfills');
const env = require('./config/env');

// 2. Application Setup
const express = require('express');
const app = express();

const database = require('./config/database');
const { cloudnairyconnect } = require('./config/cloudinary');
const initMiddlewares = require('./bootstrap/middlewares');
const initRoutes = require('./bootstrap/routes');

// 3. Service Connections
database.connect();
cloudnairyconnect();

// 4. Mount Middlewares & Routes
initMiddlewares(app);
initRoutes(app);

// 5. Server Listener
if (!process.env.VERCEL) {
    app.listen(env.PORT, () => {
        console.log(`Server is running at port ${env.PORT}`);
    });
}

module.exports = app;

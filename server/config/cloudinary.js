const cloudinary = require('cloudinary').v2;
const env = require('./env');

exports.cloudnairyconnect = () => {
    try {
        cloudinary.config({
            cloud_name: env.CLOUDINARY.CLOUD_NAME,
            api_key: env.CLOUDINARY.API_KEY,
            api_secret: env.CLOUDINARY.API_SECRET,
        });
        console.log("CD connected");
    } catch (error) {
        console.log("error connecting CD: " + error);
    }
};

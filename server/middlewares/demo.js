const env = require("../config/env");

// check if demo user
exports.isDemo = async (req, res, next) => {
    const userEmail = (req.user && req.user.email) ? req.user.email.toLowerCase() : "";
    if (env.DEMO_USERS.includes(userEmail)) {
        return res.status(401).json({
            success: false,
            message: "This is a Demo User",
        });
    }
    next();
};

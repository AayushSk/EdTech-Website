const { rateLimit } = require("express-rate-limit");

/**
 * Standard factory helper for consistent error responses and headers
 */
function createLimiter({ windowMs, max, message }) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true, // Return standard `RateLimit-*` headers
        legacyHeaders: false,  // Disable obsolete `X-RateLimit-*` headers
        message: {
            success: false,
            message: message || "Too many requests. Please try again later.",
        },
        handler: (req, res, next, options) => {
            res.status(options.statusCode).json(options.message);
        },
    });
}

// 1. Global Baseline Limiter: 100 requests per 15 minutes per IP
const globalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try after some time.",
});

// 2. Sensitive OTP Limiter: 3 requests per 5 minutes
const otpLimiter = createLimiter({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: "Too many OTP requests. Please wait few minutes before trying again.",
});

// 3. Sensitive Auth Limiter (Login, Signup, Reset Password): 5 requests per 15 minutes
const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many attempts. Please try again after some time.",
});

// 4. Financial & Payment Limiter: 10 requests per 10 minutes
const paymentLimiter = createLimiter({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many payment operations. Please wait few minutes before trying again.",
});

// 5. Heavy Search & Compute Limiter: 20 requests per 1 minute
const searchLimiter = createLimiter({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: "Too many search requests. Please slow down.",
});

// 6. Contact Us Form Limiter: 5 submissions per 15 minutes
const contactLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many contact form submissions. Please try after some time.",
});

module.exports = {
    globalLimiter,
    otpLimiter,
    authLimiter,
    paymentLimiter,
    searchLimiter,
    contactLimiter,
};

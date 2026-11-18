// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  changePassword,
} = require("../controllers/Auth")
const { sendotp } = require("../controllers/OTP")

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth")
const { otpLimiter, authLimiter } = require("../middlewares/rateLimiter")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", authLimiter, login)

// Route for user signup
router.post("/signup", authLimiter, signup)

// Route for sending OTP to the user's email
router.post("/sendotp", otpLimiter, sendotp)

// Route for Changing the password
router.post("/changepassword", auth, authLimiter, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", authLimiter, resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", authLimiter, resetPassword)

// Export the router for use in the main application
module.exports = router;
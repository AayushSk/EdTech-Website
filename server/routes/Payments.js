// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature,sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
const { paymentLimiter } = require("../middlewares/rateLimiter")

router.post("/capturePayment", auth, isStudent, paymentLimiter, capturePayment)
router.post("/verifyPayment", auth, paymentLimiter, verifySignature)
router.post("/sendPaymentSuccessEmail", auth, paymentLimiter, sendPaymentSuccessEmail)

module.exports = router;
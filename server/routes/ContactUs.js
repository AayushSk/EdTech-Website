const express = require("express")
const router = express.Router()
const { contactUs, saveGetInTouch } = require("../controllers/ContactUs");
const { contactLimiter } = require("../middlewares/rateLimiter");

router.post("/contactUs", contactLimiter, contactUs);
router.post("/getInTouch", contactLimiter, saveGetInTouch);

module.exports = router;

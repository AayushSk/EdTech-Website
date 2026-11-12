const express = require("express")
const router = express.Router()
const { contactUs, saveGetInTouch } = require("../controllers/ContactUs");

router.post("/contactUs", contactUs);
router.post("/getInTouch", saveGetInTouch);

module.exports = router;

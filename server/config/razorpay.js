const Razorpay = require("razorpay");
const env = require("./env");

exports.instance = new Razorpay({
    key_id: env.RAZORPAY.KEY || "rzp_test_placeholder",
    key_secret: env.RAZORPAY.SECRET || "placeholder_secret",
});

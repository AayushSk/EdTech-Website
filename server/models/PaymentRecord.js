const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            index: true,
        },
        paymentId: {
            type: String,
            required: true,
            unique: true, // Primary idempotency anchor for verification
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            default: "SUCCESS",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);

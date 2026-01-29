import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP expires in 5 minutes
    },
});

export const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

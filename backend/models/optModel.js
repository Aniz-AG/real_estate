import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireTime: {
    type: Date,
    required: true,
  },
},{
    timestamps: true,
});

export const Otp = mongoose.model("Otp", otpSchema);


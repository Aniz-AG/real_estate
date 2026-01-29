import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "rejected", "fulfilled"],
            default: "pending"
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

export const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

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
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            maxlength: 10,
            minlength: 10,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum:["pending","rejected","fulfilled"],
            default:"pending"
        },

    },
    {
        timestamps: true,
    }
);

export const Contact = mongoose.model("Contact", contactSchema);

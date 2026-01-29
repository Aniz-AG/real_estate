import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    address: {
        property_address: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pincode: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            maxlength: 6,
        },
    },
    property_type: {
        type: String,
        enum: ["apartment", "house", "villa"],
        default: "apartment",
    },
    price: {
        type: Number,
        required: true,
        min: 1000,
    },
    photos: [
        {
            public_id: {
                type: String,
                required: [true, "Please enter Public ID"],
            },
            url: {
                type: String,
                required: [true, "Please enter URL"],
            },
        },
    ],
    nums_bedrooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    nums_bathrooms: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    square_feet: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ["available", "sold", "rented"],
        default: "available",
    },
    usage_type: {
        type: String,
        enum: ["rent", "sale"],
        default: "rent",
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
        minlength: 10,
        trim: true,
        default: "No description provided.",
    },
    uploaded_by: {
        type: String,
        required: true,
        ref: "User",
    },
},
    {
        timestamps: true,
    }
);

export const Property = mongoose.model("Property", propertySchema);
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        default: 'Homeowner',
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 5,
    },
    testimonial: {
        type: String,
        required: [true, 'Testimonial content is required'],
        trim: true,
        maxlength: [500, 'Testimonial cannot exceed 500 characters'],
    },
    avatar: {
        public_id: String,
        url: String,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);

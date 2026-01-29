import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000, // 60 seconds timeout
});

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Verify JWT Token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Upload to Cloudinary
export const uploadToCloudinary = async (file, folder) => {
    try {
        // Debug: Check if Cloudinary is configured
        console.log('Cloudinary config check:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing',
            api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing',
            api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing',
            file_exists: file ? '✓ File provided' : '✗ No file',
        });

        const result = await cloudinary.uploader.upload(file, {
            folder,
            timeout: 120000, // 2 minute timeout for upload
            resource_type: 'auto',
        });
        console.log('✅ Cloudinary upload successful');
        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        console.error('Cloudinary upload error (full):', error);
        const errorMessage = error.error?.message || error.message || 'Unknown error';
        throw new Error(`Failed to upload image: ${errorMessage}`);
    }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error('Failed to delete image');
    }
};

// Error Handler
export class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Async Error Handler
export const asyncHandler = (fn) => (req, res) => {
    return Promise.resolve(fn(req, res)).catch((error) => {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    });
};

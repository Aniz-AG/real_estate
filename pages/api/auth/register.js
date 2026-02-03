import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { OTP } from '@/models/otpModel';
import { asyncHandler, generateToken, uploadToCloudinary } from '@/lib/helpers';
import twilio from 'twilio';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper to parse form with formidable (promisified)
const parseForm = (req) => {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: false });
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};

const handler = async (req, res) => {
    await connectDB();

    if (req.method === 'POST') {
        return handleRegister(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
};

const handleRegister = async (req, res) => {
    try {
        const { fields, files } = await parseForm(req);

        const { username, email, phone, city, state } = fields;
        const photo = files.photo;

        // Validation
        if (!username || !email || !phone || !state || !photo) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email: email[0] }, { phone: phone[0] }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists',
            });
        }

        // Upload photo to Cloudinary
        const photoPath = photo[0].filepath;
        const photoSize = photo[0].size;
        console.log('Photo details:', {
            path: photoPath,
            size: `${(photoSize / 1024).toFixed(2)} KB`,
            mimetype: photo[0].mimetype,
        });

        // Check if file exists
        if (!fs.existsSync(photoPath)) {
            return res.status(400).json({
                success: false,
                message: 'Uploaded file not found on server',
            });
        }

        const uploadedPhoto = await uploadToCloudinary(photoPath, 'users');

        // Clean up temp file
        fs.unlinkSync(photoPath);

        // Create user
        const user = await User.create({
            username: username[0],
            email: email[0],
            phone: phone[0],
            city: city?.[0] || 'Jaipur',
            state: state[0],
            photo: uploadedPhoto,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                city: user.city,
                state: user.state,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed',
        });
    }
};

export default handler;

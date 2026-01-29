import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { OTP } from '@/models/otpModel';
import { asyncHandler, generateToken } from '@/lib/helpers';
import * as cookie from 'cookie';

const handler = async (req, res) => {
    await connectDB();

    if (req.method === 'POST') {
        return verifyOtp(req, res);
    }
    res.status(405).json({ success: false, message: 'Method not allowed' });
};

const verifyOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Phone and OTP are required',
        });
    }

    const otpRecord = await OTP.findOne({ phone });

    if (!otpRecord) {
        return res.status(404).json({
            success: false,
            message: 'OTP not found or expired',
        });
    }

    if (otpRecord.otp !== otp) {
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP',
        });
    }

    const user = await User.findOne({ phone });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ phone });

    // Generate token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: 'strict',
            path: '/',
        })
    );

    res.status(200).json({
        success: true,
        message: 'Login successful',
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
});

export default handler;

import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { OTP } from '@/models/otpModel';
import twilio from 'twilio';

const handler = async (req, res) => {
    await connectDB();

    if (req.method === 'POST') {
        return sendOtp(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
};

const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required',
            });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this phone number',
            });
        }

        // Check if Twilio credentials are configured
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
            console.error('Twilio credentials not configured');

            // For development: Generate OTP without sending SMS
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await OTP.findOneAndUpdate(
                { phone },
                { otp, createdAt: new Date() },
                { upsert: true, new: true }
            );

            console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);

            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully (check console for dev mode)',
                devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
            });
        }

        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP using Twilio
        await client.messages.create({
            body: `Your OTP code is: ${otp}. Valid for 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`,
        });

        // Save OTP to the database
        await OTP.findOneAndUpdate(
            { phone },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send OTP',
        });
    }
};

export default handler;

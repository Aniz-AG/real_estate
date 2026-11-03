import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { OTP } from '@/models/otpModel';

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

        // Check if Fast2SMS credentials are configured
        if (!process.env.FAST2SMS_API_KEY) {
            console.error('Fast2SMS credentials not configured');

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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP using Fast2SMS's Quick SMS route (route=q) — no DLT-approved
        // OTP template required, just the API key.
        // https://docs.fast2sms.com/reference/quick-sms
        const fast2smsUrl = new URL('https://www.fast2sms.com/dev/bulkV2');
        fast2smsUrl.searchParams.set('route', 'q');
        fast2smsUrl.searchParams.set('message', `Your OTP code is: ${otp}. Valid for 5 minutes.`);
        fast2smsUrl.searchParams.set('numbers', phone);

        const fast2smsRes = await fetch(fast2smsUrl.toString(), {
            method: 'GET',
            headers: {
                Authorization: process.env.FAST2SMS_API_KEY,
            },
        });
        const fast2smsData = await fast2smsRes.json();

        if (!fast2smsData.return) {
            throw new Error(fast2smsData.message || 'Fast2SMS failed to send OTP');
        }

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

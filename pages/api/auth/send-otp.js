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
        if (!process.env.FAST2SMS_API_KEY || !process.env.FAST2SMS_OTP_TEMPLATE_ID) {
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

        // Send OTP using Fast2SMS's OTP route — https://docs.fast2sms.com/reference/send-otp
        const fast2smsRes = await fetch('https://www.fast2sms.com/dev/otp/send', {
            method: 'POST',
            headers: {
                Authorization: process.env.FAST2SMS_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobile: phone,
                otp_id: process.env.FAST2SMS_OTP_TEMPLATE_ID,
                otp,
                otp_expiry: 5,
                otp_length: 6,
                variables_values: '{otp}',
            }),
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

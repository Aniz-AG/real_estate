import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { generateToken } from '@/lib/helpers';

const handler = async (req, res) => {
    await connectDB();

    if (req.method === 'POST') {
        return handleRegister(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
};

const handleRegister = async (req, res) => {
    try {
        const { username, phone, city, state } = req.body;

        // Validation
        if (!username || !phone || !state) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this phone number already exists',
            });
        }

        // Create user
        const user = await User.create({
            username,
            phone,
            city: city || 'Jaipur',
            state,
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

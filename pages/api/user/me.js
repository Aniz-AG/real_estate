import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { withAuth } from '@/lib/middleware';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await connectDB();

        const user = await User.findById(req.user._id).populate('likes');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            user,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
        });
    }
}

export default withAuth(handler);

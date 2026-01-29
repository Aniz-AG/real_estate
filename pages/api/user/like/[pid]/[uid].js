import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { Property } from '@/models/propertyModel';
import { withAuth } from '@/lib/middleware';
import { asyncHandler } from '@/lib/helpers';

const handler = async (req, res) => {
    await connectDB();

    if (req.method === 'POST') {
        return toggleLike(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
};

const toggleLike = asyncHandler(async (req, res) => {
    const { pid, uid } = req.query;

    const property = await Property.findById(pid);
    if (!property) {
        return res.status(404).json({
            success: false,
            message: 'Property not found',
        });
    }

    const user = await User.findById(uid);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const isLiked = user.likes.includes(pid);

    if (isLiked) {
        user.likes = user.likes.filter((id) => id !== pid);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Property unliked successfully',
            liked: false,
        });
    } else {
        user.likes.push(pid);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Property liked successfully',
            liked: true,
        });
    }
});

export default withAuth(handler);

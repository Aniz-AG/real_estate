import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { withAuth } from '@/lib/middleware';

async function handler(req, res) {
    const { params } = req.query;

    // params can be [pid, uid] for /api/property/like/pid/uid
    if (!params || params.length < 2) {
        return res.status(400).json({ success: false, message: 'Property ID and User ID are required' });
    }

    const [pid, uid] = params;

    await connectDB();

    if (req.method === 'GET') {
        // Check if property is liked by user
        try {
            const user = await User.findById(uid);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const isLiked = user.likes?.includes(pid) || false;
            res.status(200).json({ success: true, isLiked });
        } catch (error) {
            console.error('Error checking like status:', error);
            res.status(500).json({ success: false, message: 'Failed to check like status' });
        }
    } else if (req.method === 'POST') {
        // Toggle like
        try {
            const user = await User.findById(uid);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const isLiked = user.likes?.includes(pid) || false;

            if (isLiked) {
                // Unlike
                user.likes = user.likes.filter(p => p.toString() !== pid);
            } else {
                // Like
                if (!user.likes) {
                    user.likes = [];
                }
                user.likes.push(pid);
            }

            await user.save();

            res.status(200).json({
                success: true,
                isLiked: !isLiked,
                message: isLiked ? 'Property unliked' : 'Property liked'
            });
        } catch (error) {
            console.error('Error toggling like:', error);
            res.status(500).json({ success: false, message: 'Failed to toggle like' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

export default withAuth(handler);

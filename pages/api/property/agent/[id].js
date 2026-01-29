import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';

export default async function handler(req, res) {
    await connectDB();

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        const agent = await User.findById(id).select('-likes');

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found',
            });
        }

        res.status(200).json({
            success: true,
            agent,
        });
    } catch (error) {
        console.error('Get agent error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch agent',
        });
    }
}

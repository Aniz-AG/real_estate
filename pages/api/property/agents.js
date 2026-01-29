import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { asyncHandler } from '@/lib/helpers';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        return getAgents(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
}

const getAgents = asyncHandler(async (req, res) => {
    const agents = await User.find({ role: 'admin' }).select('-likes');

    res.status(200).json({
        success: true,
        message: 'Agents fetched successfully',
        agents,
    });
});

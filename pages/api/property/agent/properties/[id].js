import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { User } from '@/models/userModel'; // Required for populate

export default async function handler(req, res) {
    await connectDB();

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        const properties = await Property.find({ uploaded_by: id })
            .sort({ createdAt: -1 })
            .populate('uploaded_by', 'username email photo city state');

        res.status(200).json({
            success: true,
            properties,
            count: properties.length,
        });
    } catch (error) {
        console.error('Get agent properties error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch agent properties',
        });
    }
}

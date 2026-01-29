import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { User } from '@/models/userModel'; // Required for populate to work

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const properties = await Property.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('uploaded_by', 'username email photo city state');

            return res.status(200).json({
                success: true,
                message: 'Latest properties fetched successfully',
                properties,
            });
        } catch (error) {
            console.error('Error fetching latest properties:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
}

import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { User } from '@/models/userModel'; // Required for populate
import { asyncHandler } from '@/lib/helpers';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        return getProperty(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
}

const getProperty = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const property = await Property.findById(id).populate(
        'uploaded_by',
        'username email photo city state phone'
    );

    if (!property) {
        return res.status(404).json({
            success: false,
            message: 'Property not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Property fetched successfully',
        property,
    });
});

import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { User } from '@/models/userModel'; // Required for populate
import { asyncHandler } from '@/lib/helpers';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'POST') {
        return searchProperties(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
}

const searchProperties = asyncHandler(async (req, res) => {
    const {
        city,
        state,
        property_type,
        usage_type,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        status,
    } = req.body;

    const filter = {};

    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (state) filter['address.state'] = new RegExp(state, 'i');
    if (property_type) filter.property_type = property_type;
    if (usage_type) filter.usage_type = usage_type;
    if (status) filter.status = status;
    if (bedrooms) filter.nums_bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter.nums_bathrooms = { $gte: parseInt(bathrooms) };

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseInt(minPrice);
        if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const properties = await Property.find(filter)
        .populate('uploaded_by', 'username email photo city state')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: 'Properties fetched successfully',
        properties,
        count: properties.length,
    });
});

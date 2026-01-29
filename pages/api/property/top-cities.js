import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { asyncHandler } from '@/lib/helpers';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        return getTopCities(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
}

const getTopCities = asyncHandler(async (req, res) => {
    const cities = await Property.aggregate([
        {
            $group: {
                _id: '$address.city',
                count: { $sum: 1 },
                state: { $first: '$address.state' },
            },
        },
        {
            $sort: { count: -1 },
        },
        {
            $limit: 5,
        },
        {
            $project: {
                _id: 0,
                city: '$_id',
                state: 1,
                count: 1,
            },
        },
    ]);

    res.status(200).json({
        success: true,
        message: 'Top cities fetched successfully',
        cities,
    });
});

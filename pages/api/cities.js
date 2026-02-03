import { INDIA_CITIES } from '@/lib/indiaCities';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const query = (req.query?.query || '').toString().trim().toLowerCase();
    const limit = Math.min(parseInt(req.query?.limit || '50', 10), 100);

    if (!query) {
        return res.status(200).json({
            success: true,
            cities: INDIA_CITIES.slice(0, limit),
        });
    }

    const results = INDIA_CITIES.filter((city) =>
        `${city.name} ${city.state}`.toLowerCase().includes(query)
    ).slice(0, limit);

    return res.status(200).json({
        success: true,
        cities: results,
    });
}

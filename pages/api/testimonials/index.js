import { connectDB } from '@/lib/db';
import { Testimonial } from '@/models/testimonialModel';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            // Get only approved testimonials for public view
            const testimonials = await Testimonial.find({ isApproved: true })
                .sort({ isFeatured: -1, createdAt: -1 })
                .limit(20);

            res.status(200).json({
                success: true,
                testimonials,
            });
        } catch (error) {
            console.error('Fetch testimonials error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch testimonials',
            });
        }
    } else if (req.method === 'POST') {
        try {
            const { name, email, role, location, rating, testimonial } = req.body;

            if (!name || !email || !testimonial) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, email, and testimonial are required',
                });
            }

            // Check if user already submitted a testimonial
            const existing = await Testimonial.findOne({ email });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already submitted a testimonial',
                });
            }

            const newTestimonial = await Testimonial.create({
                name,
                email,
                role: role || 'Homeowner',
                location,
                rating: rating || 5,
                testimonial,
                isApproved: false, // Requires admin approval
            });

            res.status(201).json({
                success: true,
                message: 'Thank you! Your testimonial has been submitted for review.',
                testimonial: newTestimonial,
            });
        } catch (error) {
            console.error('Submit testimonial error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to submit testimonial',
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
}

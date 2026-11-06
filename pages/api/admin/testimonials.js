import { connectDB } from '@/lib/db';
import { Testimonial } from '@/models/testimonialModel';
import { withAuth } from '@/lib/middleware';

async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const testimonials = await Testimonial.find()
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                testimonials,
            });
        } catch (error) {
            console.error('Admin fetch testimonials error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch testimonials',
            });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, isApproved, isFeatured } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Testimonial ID is required',
                });
            }

            const testimonial = await Testimonial.findByIdAndUpdate(
                id,
                { isApproved, isFeatured },
                { new: true }
            );

            if (!testimonial) {
                return res.status(404).json({
                    success: false,
                    message: 'Testimonial not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Testimonial updated successfully',
                testimonial,
            });
        } catch (error) {
            console.error('Update testimonial error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update testimonial',
            });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Testimonial ID is required',
                });
            }

            const testimonial = await Testimonial.findByIdAndDelete(id);

            if (!testimonial) {
                return res.status(404).json({
                    success: false,
                    message: 'Testimonial not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Testimonial deleted successfully',
            });
        } catch (error) {
            console.error('Delete testimonial error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete testimonial',
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
    }
}

export default withAuth(handler, true); // Admin only

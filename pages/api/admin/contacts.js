import { connectDB } from '@/lib/db';
import { Contact } from '@/models/ContactModel';
import { withAuth } from '@/lib/middleware';

async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const { page = 1, limit = 12, search = '', filter = 'all' } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;

            // Build query
            let query = {};

            // Search filter
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                    { message: { $regex: search, $options: 'i' } },
                ];
            }

            // Read/unread filter
            if (filter === 'read') {
                query.isRead = true;
            } else if (filter === 'unread') {
                query.isRead = false;
            }

            const [contacts, total, unreadCount] = await Promise.all([
                Contact.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNum),
                Contact.countDocuments(query),
                Contact.countDocuments({ isRead: false }),
            ]);

            res.status(200).json({
                success: true,
                contacts,
                total,
                unreadCount,
                totalPages: Math.ceil(total / limitNum),
                currentPage: pageNum,
            });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { contactId, isRead } = req.body;

            if (!contactId || isRead === undefined) {
                return res.status(400).json({ success: false, message: 'Contact ID and isRead status are required' });
            }

            const contact = await Contact.findByIdAndUpdate(
                contactId,
                { isRead },
                { new: true }
            );

            if (!contact) {
                return res.status(404).json({ success: false, message: 'Contact not found' });
            }

            res.status(200).json({ success: true, contact });
        } catch (error) {
            console.error('Error updating contact:', error);
            res.status(500).json({ success: false, message: 'Failed to update contact' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Contact ID is required' });
            }

            const contact = await Contact.findByIdAndDelete(id);

            if (!contact) {
                return res.status(404).json({ success: false, message: 'Contact not found' });
            }

            res.status(200).json({ success: true, message: 'Contact deleted successfully' });
        } catch (error) {
            console.error('Error deleting contact:', error);
            res.status(500).json({ success: false, message: 'Failed to delete contact' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

export default withAuth(handler, true); // true = admin only

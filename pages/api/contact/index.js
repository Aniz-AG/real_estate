import { connectDB } from '@/lib/db';
import { Contact } from '@/models/ContactModel';
import { asyncHandler } from '@/lib/helpers';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'POST') {
        return createContact(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
}

const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        message,
        status: 'pending',
    });

    res.status(201).json({
        success: true,
        message: 'Contact message sent successfully',
        contact,
    });
});

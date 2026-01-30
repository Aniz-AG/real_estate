import { connectDB } from '@/lib/db';
import { User } from '@/models/userModel';
import { withAuth } from '@/lib/middleware';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/helpers';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await connectDB();

        const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB
        });

        const [fields, files] = await form.parse(req);

        const username = fields.username?.[0];
        const city = fields.city?.[0];
        const state = fields.state?.[0];

        // Validate required fields
        if (!username || !city || !state) {
            return res.status(400).json({
                success: false,
                message: 'Username, city, and state are required',
            });
        }

        // Validate field lengths
        if (username.length < 2 || username.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Username must be 2-50 characters',
            });
        }

        if (city.length < 2 || city.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'City must be 2-50 characters',
            });
        }

        if (state.length < 2 || state.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'State must be 2-50 characters',
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update basic fields (email and phone are NOT updated - locked)
        user.username = username;
        user.city = city;
        user.state = state;

        // Handle optional photo upload
        const photoFile = files.file?.[0];
        if (photoFile && photoFile.filepath) {
            // Delete old photo if exists
            if (user.photo?.public_id) {
                try {
                    await deleteFromCloudinary(user.photo.public_id);
                } catch (err) {
                    console.error('Failed to delete old photo:', err);
                }
            }

            // Upload new photo
            const uploadedPhoto = await uploadToCloudinary(photoFile.filepath, 'users');
            user.photo = {
                public_id: uploadedPhoto.public_id,
                url: uploadedPhoto.url,
            };
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update profile',
        });
    }
}

export default withAuth(handler);

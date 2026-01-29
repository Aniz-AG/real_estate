import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { withAuth } from '@/lib/middleware';
import { uploadToCloudinary } from '@/lib/helpers';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await connectDB();

    try {
        // Parse form data
        const form = formidable({
            multiples: true,
            maxFileSize: 10 * 1024 * 1024 // 10MB
        });

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        // Helper to get field value
        const getField = (name) => {
            const value = fields[name];
            return Array.isArray(value) ? value[0] : value;
        };

        // Upload images to Cloudinary
        const imageFiles = files.images;
        const photos = [];

        if (imageFiles) {
            const fileArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];

            for (const file of fileArray) {
                if (file && file.filepath) {
                    try {
                        const result = await uploadToCloudinary(file.filepath, 'properties');
                        photos.push({
                            public_id: result.public_id,
                            url: result.url
                        });
                        // Clean up temp file
                        fs.unlink(file.filepath, (err) => {
                            if (err) console.error('Error deleting temp file:', err);
                        });
                    } catch (uploadError) {
                        console.error('Error uploading image:', uploadError);
                    }
                }
            }
        }

        if (photos.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one image is required' });
        }

        // Create property with the correct schema structure
        const property = await Property.create({
            address: {
                property_address: getField('address'),
                city: getField('city'),
                state: getField('state'),
                pincode: getField('pincode') || '000000'
            },
            property_type: getField('propertyType') || 'apartment',
            price: Number(getField('price')),
            photos,
            nums_bedrooms: Number(getField('bedrooms')) || 1,
            nums_bathrooms: Number(getField('bathrooms')) || 1,
            square_feet: Number(getField('area')) || 1,
            status: 'available',
            usage_type: getField('status') === 'rent' ? 'rent' : 'sale',
            description: getField('description') || 'No description provided.',
            uploaded_by: req.user._id.toString()
        });

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            property
        });

    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create property' });
    }
}

export default withAuth(handler, true); // Admin only

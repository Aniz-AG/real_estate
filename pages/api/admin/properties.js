import { connectDB } from '@/lib/db';
import { Property } from '@/models/propertyModel';
import { User } from '@/models/userModel'; // Required for populate
import { withAuth } from '@/lib/middleware';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
    api: {
        bodyParser: false,
    },
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = async (req, res) => {
    await connectDB();

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required',
        });
    }

    if (req.method === 'GET') {
        return getProperties(req, res);
    } else if (req.method === 'PUT') {
        return updateProperty(req, res);
    } else if (req.method === 'DELETE') {
        return deleteProperty(req, res);
    }

    res.status(405).json({ success: false, message: 'Method not allowed' });
};

const getProperties = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;
        const limit = 12;
        const skip = (parseInt(page) - 1) * limit;

        const query = search
            ? {
                $or: [
                    { 'address.city': { $regex: search, $options: 'i' } },
                    { 'address.state': { $regex: search, $options: 'i' } },
                    { property_type: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const [properties, total] = await Promise.all([
            Property.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('uploaded_by', 'username email'),
            Property.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            properties,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        });
    } catch (error) {
        console.error('Get admin properties error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch properties',
        });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Property ID is required' });
        }

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ success: false, message: 'Error parsing form data' });
            }

            // Get single values from fields
            const getValue = (field) => Array.isArray(field) ? field[0] : field;

            // Update property fields
            property.address = {
                property_address: getValue(fields.property_address) || property.address.property_address,
                city: getValue(fields.city) || property.address.city,
                state: getValue(fields.state) || property.address.state,
                pincode: getValue(fields.pincode) || property.address.pincode,
            };
            property.property_type = getValue(fields.property_type) || property.property_type;
            property.usage_type = getValue(fields.usage_type) || property.usage_type;
            property.price = parseInt(getValue(fields.price)) || property.price;
            property.square_feet = parseInt(getValue(fields.square_feet)) || property.square_feet;
            property.nums_bedrooms = parseInt(getValue(fields.nums_bedrooms)) || property.nums_bedrooms;
            property.nums_bathrooms = parseInt(getValue(fields.nums_bathrooms)) || property.nums_bathrooms;
            property.description = getValue(fields.description) || property.description;

            // Handle photos to remove
            if (fields.photosToRemove) {
                const photosToRemove = JSON.parse(getValue(fields.photosToRemove));
                for (const publicId of photosToRemove) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (e) {
                        console.error('Error deleting image:', e);
                    }
                }
            }

            // Update existing photos from form
            if (fields.existingPhotos) {
                property.photos = JSON.parse(getValue(fields.existingPhotos));
            }

            // Upload new photos
            let newPhotos = files.photos;
            if (newPhotos && !Array.isArray(newPhotos)) {
                newPhotos = [newPhotos];
            }

            if (newPhotos && newPhotos.length > 0) {
                for (const photo of newPhotos) {
                    try {
                        const result = await cloudinary.uploader.upload(photo.filepath, {
                            folder: 'real-estate',
                        });
                        property.photos.push({
                            public_id: result.public_id,
                            url: result.secure_url,
                        });
                    } catch (uploadError) {
                        console.error('Error uploading image:', uploadError);
                    }
                }
            }

            await property.save();

            res.status(200).json({
                success: true,
                message: 'Property updated successfully',
                property,
            });
        });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update property',
        });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Property ID is required' });
        }

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Delete photos from Cloudinary
        if (property.photos && property.photos.length > 0) {
            for (const photo of property.photos) {
                if (photo.public_id) {
                    try {
                        await cloudinary.uploader.destroy(photo.public_id);
                    } catch (e) {
                        console.error('Error deleting image:', e);
                    }
                }
            }
        }

        await Property.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully',
        });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete property',
        });
    }
};

export default withAuth(handler, true); // true = require admin

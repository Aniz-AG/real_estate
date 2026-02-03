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
            const parseBool = (field) => {
                const value = getValue(field);
                if (value === undefined || value === null || value === '') return undefined;
                if (typeof value === 'boolean') return value;
                return value === 'true' || value === 'on' || value === '1';
            };
            const parseNumber = (field) => {
                const value = getValue(field);
                if (value === undefined || value === null || value === '') return undefined;
                const num = Number(value);
                return Number.isFinite(num) ? num : undefined;
            };

            // Update property fields
            property.title = getValue(fields.title) || property.title;
            property.description = getValue(fields.description) || property.description;
            property.property_category = getValue(fields.property_category) || property.property_category;
            property.property_type = getValue(fields.property_type) || property.property_type;
            property.bhk_type = getValue(fields.bhk_type) || property.bhk_type;
            property.usage_type = getValue(fields.usage_type) || property.usage_type;

            property.address = {
                property_address: getValue(fields.property_address) || property.address.property_address,
                locality: getValue(fields.locality) || property.address.locality,
                city: getValue(fields.city) || property.address.city,
                state: getValue(fields.state) || property.address.state,
                pincode: getValue(fields.pincode) || property.address.pincode,
            };

            const price = parseNumber(fields.price);
            if (price !== undefined) property.price = price;
            const pricePerSqft = parseNumber(fields.price_per_sqft);
            if (pricePerSqft !== undefined) property.price_per_sqft = pricePerSqft;
            const maintenance = parseNumber(fields.maintenance_charges);
            if (maintenance !== undefined) property.maintenance_charges = maintenance;
            const negotiable = parseBool(fields.is_negotiable);
            if (negotiable !== undefined) property.is_negotiable = negotiable;

            const coveredArea = parseNumber(fields.covered_area);
            if (coveredArea !== undefined) property.covered_area = coveredArea;
            const carpetArea = parseNumber(fields.carpet_area);
            if (carpetArea !== undefined) property.carpet_area = carpetArea;
            const plotArea = parseNumber(fields.plot_area);
            if (plotArea !== undefined) property.plot_area = plotArea;
            const sqft = parseNumber(fields.square_feet);
            if (sqft !== undefined) property.square_feet = sqft;
            const bedrooms = parseNumber(fields.nums_bedrooms);
            if (bedrooms !== undefined) property.nums_bedrooms = bedrooms;
            const bathrooms = parseNumber(fields.nums_bathrooms);
            if (bathrooms !== undefined) property.nums_bathrooms = bathrooms;
            const balconies = parseNumber(fields.nums_balconies);
            if (balconies !== undefined) property.nums_balconies = balconies;

            property.floor_number = getValue(fields.floor_number) || property.floor_number;
            const totalFloors = parseNumber(fields.total_floors);
            if (totalFloors !== undefined) property.total_floors = totalFloors;

            property.possession_status = getValue(fields.possession_status) || property.possession_status;
            const possessionDate = getValue(fields.possession_date);
            if (possessionDate) property.possession_date = new Date(possessionDate);
            property.status = getValue(fields.status) || property.status;
            property.sale_type = getValue(fields.sale_type) || property.sale_type;
            property.facing = getValue(fields.facing) || property.facing;
            property.property_age = getValue(fields.property_age) || property.property_age;
            property.ownership = getValue(fields.ownership) || property.ownership;
            property.furnishing = getValue(fields.furnishing) || property.furnishing;
            property.posted_by_type = getValue(fields.posted_by_type) || property.posted_by_type;

            property.project_name = getValue(fields.project_name) || property.project_name;
            property.builder_name = getValue(fields.builder_name) || property.builder_name;

            property.contact_phone = getValue(fields.contact_phone) || property.contact_phone;
            property.contact_email = getValue(fields.contact_email) || property.contact_email;

            property.video_url = getValue(fields.video_url) || property.video_url;

            const isVerified = parseBool(fields.is_verified);
            if (isVerified !== undefined) property.is_verified = isVerified;
            const isFeatured = parseBool(fields.is_featured);
            if (isFeatured !== undefined) property.is_featured = isFeatured;
            const isTopProject = parseBool(fields.is_top_project);
            if (isTopProject !== undefined) property.is_top_project = isTopProject;
            const isPremium = parseBool(fields.is_premium);
            if (isPremium !== undefined) property.is_premium = isPremium;

            if (fields.amenities) {
                try {
                    property.amenities = JSON.parse(getValue(fields.amenities));
                } catch (e) {
                    // ignore malformed amenities
                }
            }

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

            property.has_photos = property.photos?.length > 0;
            property.has_videos = !!property.video_url;

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

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

        // Parse amenities from form data
        const amenities = {};
        const amenityFields = [
            'reserved_parking', 'visitor_parking', 'lift', 'power_backup',
            'gas_pipeline', 'park', 'kids_play_area', 'gymnasium', 'swimming_pool',
            'club_house', 'security', 'cctv', 'fire_safety', 'water_storage',
            'rain_water_harvesting', 'sewage_treatment', 'intercom', 'maintenance_staff'
        ];
        amenityFields.forEach(amenity => {
            const value = getField(amenity);
            if (value === 'true' || value === true) {
                amenities[amenity] = true;
            }
        });

        // Create property with the expanded schema structure
        const property = await Property.create({
            title: getField('title') || '',
            address: {
                property_address: getField('address'),
                locality: getField('locality') || '',
                city: getField('city'),
                state: getField('state'),
                pincode: getField('pincode') || '000000'
            },
            property_category: getField('propertyCategory') || 'residential',
            property_type: getField('propertyType') || 'apartment',
            bhk_type: getField('bhkType') || '',
            price: Number(getField('price')),
            price_per_sqft: getField('pricePerSqft') ? Number(getField('pricePerSqft')) : undefined,
            is_negotiable: getField('isNegotiable') === 'true',
            maintenance_charges: getField('maintenanceCharges') ? Number(getField('maintenanceCharges')) : 0,
            photos,
            video_url: getField('videoUrl') || '',
            has_photos: photos.length > 0,
            has_videos: !!getField('videoUrl'),
            nums_bedrooms: Number(getField('bedrooms')) || 1,
            nums_bathrooms: Number(getField('bathrooms')) || 1,
            nums_balconies: Number(getField('balconies')) || 0,
            covered_area: getField('coveredArea') ? Number(getField('coveredArea')) : undefined,
            carpet_area: getField('carpetArea') ? Number(getField('carpetArea')) : undefined,
            plot_area: getField('plotArea') ? Number(getField('plotArea')) : undefined,
            square_feet: Number(getField('area')) || 1,
            floor_number: getField('floorNumber') || '',
            total_floors: Number(getField('totalFloors')) || 1,
            possession_status: getField('possessionStatus') || '',
            possession_date: getField('possessionDate') ? new Date(getField('possessionDate')) : undefined,
            status: 'available',
            usage_type: getField('usageType') || 'sale',
            sale_type: getField('saleType') || '',
            facing: getField('facing') || '',
            property_age: getField('propertyAge') || '',
            ownership: getField('ownership') || '',
            furnishing: getField('furnishing') || '',
            posted_by_type: getField('postedByType') || 'owner',
            amenities,
            is_verified: false,
            is_featured: getField('isFeatured') === 'true',
            is_top_project: getField('isTopProject') === 'true',
            is_premium: getField('isPremium') === 'true',
            project_name: getField('projectName') || '',
            builder_name: getField('builderName') || '',
            description: getField('description') || 'No description provided.',
            contact_phone: getField('contactPhone') || '',
            contact_email: getField('contactEmail') || '',
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

import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        trim: true,
        maxlength: 200,
    },

    // Address Details
    address: {
        property_address: {
            type: String,
            required: true,
            trim: true,
        },
        locality: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pincode: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            maxlength: 6,
        },
    },

    // Property Category
    property_category: {
        type: String,
        enum: ["residential", "commercial", "other"],
        default: "residential",
    },

    // Property Type (Sub Property Type)
    property_type: {
        type: String,
        enum: [
            // Residential
            "flat", "apartment", "multistorey_apartment", "builder_floor",
            "penthouse", "studio_apartment", "residential_house", "villa",
            "house", "plot", "land",
            // Commercial
            "office_space", "shop", "showroom", "commercial_land",
            "warehouse", "godown", "industrial_building", "industrial_shed",
            // Other
            "agricultural_land", "farm_house"
        ],
        default: "apartment",
    },

    // BHK Configuration
    bhk_type: {
        type: String,
        enum: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK", ""],
        default: "",
    },

    // Pricing
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    price_per_sqft: {
        type: Number,
        min: 0,
    },
    is_negotiable: {
        type: Boolean,
        default: false,
    },
    maintenance_charges: {
        type: Number,
        default: 0,
    },

    // Photos & Videos
    photos: [
        {
            public_id: {
                type: String,
                required: [true, "Please enter Public ID"],
            },
            url: {
                type: String,
                required: [true, "Please enter URL"],
            },
        },
    ],
    video_url: {
        type: String,
        trim: true,
    },
    has_photos: {
        type: Boolean,
        default: false,
    },
    has_videos: {
        type: Boolean,
        default: false,
    },

    // Specifications
    nums_bedrooms: {
        type: Number,
        min: 0,
        max: 20,
        default: 1,
    },
    nums_bathrooms: {
        type: Number,
        min: 0,
        max: 20,
        default: 1,
    },
    nums_balconies: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },

    // Area Details
    covered_area: {
        type: Number,
        min: 0,
    },
    carpet_area: {
        type: Number,
        min: 0,
    },
    plot_area: {
        type: Number,
        min: 0,
    },
    square_feet: {
        type: Number,
        min: 1,
        default: 1,
    },

    // Floor Details
    floor_number: {
        type: String,
        enum: ["basement", "ground", "1-4", "5-8", "9-12", "13-16", "16+", ""],
        default: "",
    },
    total_floors: {
        type: Number,
        min: 0,
        default: 1,
    },

    // Possession & Status
    possession_status: {
        type: String,
        enum: ["ready_to_move", "under_construction", ""],
        default: "",
    },
    possession_date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["available", "sold", "rented"],
        default: "available",
    },
    usage_type: {
        type: String,
        enum: ["rent", "sale"],
        default: "sale",
    },

    // Sale Type
    sale_type: {
        type: String,
        enum: ["new", "resale", ""],
        default: "",
    },

    // Facing Direction
    facing: {
        type: String,
        enum: ["east", "west", "north", "south", "north-east", "north-west", "south-east", "south-west", ""],
        default: "",
    },

    // Age of Property
    property_age: {
        type: String,
        enum: ["under_construction", "less_than_1_year", "1_to_5_years", "5_to_10_years", "more_than_10_years", ""],
        default: "",
    },

    // Ownership Type
    ownership: {
        type: String,
        enum: ["freehold", "leasehold", "power_of_attorney", "cooperative_society", ""],
        default: "",
    },

    // Furnishing Status
    furnishing: {
        type: String,
        enum: ["furnished", "semi_furnished", "unfurnished", ""],
        default: "",
    },

    // Posted By
    posted_by_type: {
        type: String,
        enum: ["owner", "agent", "builder", ""],
        default: "",
    },

    // Amenities
    amenities: {
        reserved_parking: { type: Boolean, default: false },
        visitor_parking: { type: Boolean, default: false },
        lift: { type: Boolean, default: false },
        power_backup: { type: Boolean, default: false },
        gas_pipeline: { type: Boolean, default: false },
        park: { type: Boolean, default: false },
        kids_play_area: { type: Boolean, default: false },
        gymnasium: { type: Boolean, default: false },
        swimming_pool: { type: Boolean, default: false },
        club_house: { type: Boolean, default: false },
        security: { type: Boolean, default: false },
        cctv: { type: Boolean, default: false },
        fire_safety: { type: Boolean, default: false },
        water_storage: { type: Boolean, default: false },
        rain_water_harvesting: { type: Boolean, default: false },
        sewage_treatment: { type: Boolean, default: false },
        intercom: { type: Boolean, default: false },
        maintenance_staff: { type: Boolean, default: false },
        shopping_center: { type: Boolean, default: false },
        hospital: { type: Boolean, default: false },
        school: { type: Boolean, default: false },
        atm: { type: Boolean, default: false },
    },

    // Verified Property
    is_verified: {
        type: Boolean,
        default: false,
    },

    // Featured Property (for homepage sections)
    is_featured: {
        type: Boolean,
        default: false,
    },
    is_top_project: {
        type: Boolean,
        default: false,
    },
    is_premium: {
        type: Boolean,
        default: false,
    },

    // Project/Builder Info
    project_name: {
        type: String,
        trim: true,
    },
    builder_name: {
        type: String,
        trim: true,
    },

    // Description
    description: {
        type: String,
        maxlength: 2000,
        trim: true,
        default: "No description provided.",
    },

    // User who uploaded
    uploaded_by: {
        type: String,
        required: true,
        ref: "User",
    },

    // View Count
    views: {
        type: Number,
        default: 0,
    },

    // Contact Info (optional override)
    contact_phone: {
        type: String,
        trim: true,
    },
    contact_email: {
        type: String,
        trim: true,
    },
},
    {
        timestamps: true,
    }
);

// Index for efficient searching
propertySchema.index({ "address.city": 1 });
propertySchema.index({ "address.locality": 1 });
propertySchema.index({ property_type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ nums_bedrooms: 1 });
propertySchema.index({ possession_status: 1 });
propertySchema.index({ is_featured: 1 });
propertySchema.index({ createdAt: -1 });

export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);

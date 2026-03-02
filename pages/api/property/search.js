import { connectDB } from "@/lib/db";
import { Property } from "@/models/propertyModel";
import { User } from "@/models/userModel"; // Required for populate
import { asyncHandler } from "@/lib/helpers";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    return searchProperties(req, res);
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}

const searchProperties = asyncHandler(async (req, res) => {
  const {
    city,
    state,
    locality,
    property_category,
    property_type,
    bhk_type,
    usage_type,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    possession_status,
    sale_type,
    posted_since,
    posted_by,
    ownership,
    furnishing,
    amenities,
    facing,
    floor,
    bathrooms,
    bedrooms,
    has_photos,
    has_videos,
    verified_only,
    status,
    sort_by,
    page,
    limit,
  } = req.body;

  const filter = {};

  // Location filters - Use exact case-insensitive match for city to avoid partial matches
  if (city) {
    const escapeRegExp = (value) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cityList = city
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (cityList.length === 1) {
      filter["address.city"] = {
        $regex: new RegExp(`^${escapeRegExp(cityList[0])}$`, "i"),
      };
    } else if (cityList.length > 1) {
      filter["address.city"] = {
        $in: cityList.map(
          (value) => new RegExp(`^${escapeRegExp(value)}$`, "i"),
        ),
      };
    }
  }
  if (state) filter["address.state"] = new RegExp(state, "i");
  if (locality) filter["address.locality"] = new RegExp(locality, "i");

  if (property_category) {
    filter.property_category = property_category;
  }

  // Property type filter (can be comma-separated) with alias expansion
  if (property_type) {
    const aliasMap = {
      flat: ["flat", "apartment", "multistorey_apartment"],
      house: ["house", "villa", "residential_house"],
      plot_land: ["plot", "land", "commercial_land"],
      commercial_office: ["office_space"],
      shops_showrooms: ["shop", "showroom"],
      other_commercial: [
        "warehouse",
        "godown",
        "industrial_building",
        "industrial_shed",
      ],
      agricultural_land: ["agricultural_land"],
      farm_house: ["farm_house"],
    };
    const types = property_type.split(",").filter(Boolean);
    if (types.length > 0) {
      const expanded = new Set();
      types.forEach((type) => {
        if (aliasMap[type]) {
          aliasMap[type].forEach((value) => expanded.add(value));
        } else {
          expanded.add(type);
        }
      });
      filter.property_type = { $in: Array.from(expanded) };
    }
  }

  // BHK type filter (can be comma-separated)
  if (bhk_type) {
    const bhks = bhk_type.split(",").filter(Boolean);
    if (bhks.length > 0) {
      filter.bhk_type = { $in: bhks };
    }
  }

  if (usage_type) filter.usage_type = usage_type;
  if (status) filter.status = status;

  // Bedroom/Bathroom filters
  if (bedrooms) filter.nums_bedrooms = { $gte: parseInt(bedrooms) };
  if (bathrooms) {
    const bathroomValues = bathrooms.split(",").filter(Boolean).map(Number);
    if (bathroomValues.length > 0) {
      filter.nums_bathrooms = { $in: bathroomValues };
    }
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Area range filter
  if (minArea || maxArea) {
    filter.$or = filter.$or || [];
    const areaFilter = {};
    if (minArea) areaFilter.$gte = parseInt(minArea);
    if (maxArea) areaFilter.$lte = parseInt(maxArea);
    filter.$or.push(
      { covered_area: areaFilter },
      { square_feet: areaFilter },
      { carpet_area: areaFilter },
    );
  }

  // Possession status filter (can be comma-separated)
  if (possession_status) {
    const statuses = possession_status.split(",").filter(Boolean);
    if (statuses.length > 0) {
      filter.possession_status = { $in: statuses };
    }
  }

  // Sale type filter (can be comma-separated)
  if (sale_type) {
    const types = sale_type.split(",").filter(Boolean);
    if (types.length > 0) {
      filter.sale_type = { $in: types };
    }
  }

  // Posted since filter (days ago)
  if (posted_since && posted_since !== "") {
    const days = parseInt(posted_since);
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    filter.createdAt = { $gte: dateThreshold };
  }

  // Posted by filter (can be comma-separated)
  if (posted_by) {
    const posters = posted_by.split(",").filter(Boolean);
    if (posters.length > 0) {
      filter.posted_by_type = { $in: posters };
    }
  }

  // Ownership filter (can be comma-separated)
  if (ownership) {
    const ownerships = ownership.split(",").filter(Boolean);
    if (ownerships.length > 0) {
      filter.ownership = { $in: ownerships };
    }
  }

  // Furnishing filter (can be comma-separated)
  if (furnishing) {
    const furnishings = furnishing.split(",").filter(Boolean);
    if (furnishings.length > 0) {
      filter.furnishing = { $in: furnishings };
    }
  }

  // Amenities filter (can be comma-separated)
  if (amenities) {
    const amenityList = amenities.split(",").filter(Boolean);
    if (amenityList.length > 0) {
      amenityList.forEach((amenity) => {
        filter[`amenities.${amenity}`] = true;
      });
    }
  }

  // Facing filter (can be comma-separated)
  if (facing) {
    const facings = facing.split(",").filter(Boolean);
    if (facings.length > 0) {
      filter.facing = { $in: facings };
    }
  }

  // Floor filter (can be comma-separated)
  if (floor) {
    const floors = floor.split(",").filter(Boolean);
    if (floors.length > 0) {
      filter.floor_number = { $in: floors };
    }
  }

  // Has photos filter
  if (has_photos === true || has_photos === "true") {
    filter["photos.0"] = { $exists: true };
  }

  // Has videos filter
  if (has_videos === true || has_videos === "true") {
    filter.video_url = { $exists: true, $ne: "" };
  }

  // Verified only filter
  if (verified_only === true || verified_only === "true") {
    filter.is_verified = true;
  }

  // Determine sort order
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort_by === "price_low") {
    sortOption = { price: 1 };
  } else if (sort_by === "price_high") {
    sortOption = { price: -1 };
  } else if (sort_by === "newest") {
    sortOption = { createdAt: -1 };
  } else if (sort_by === "rate_low") {
    sortOption = { price_per_sqft: 1 };
  } else if (sort_by === "rate_high") {
    sortOption = { price_per_sqft: -1 };
  }

  const pageNumber = Math.max(parseInt(page || 1), 1);
  const perPage = Math.min(Math.max(parseInt(limit || 12), 1), 50);
  const skip = (pageNumber - 1) * perPage;

  const results = await Property.find(filter)
    .populate("uploaded_by", "username email photo city state")
    .sort(sortOption)
    .skip(skip)
    .limit(perPage + 1); // Fetch one extra to determine hasMore

  const hasMore = results.length > perPage;
  const properties = hasMore ? results.slice(0, perPage) : results;

  res.status(200).json({
    success: true,
    message: "Properties fetched successfully",
    properties,
    count: properties.length,
    page: pageNumber,
    perPage,
    hasMore,
  });
});

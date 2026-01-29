import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Property } from "../models/propertyModel.js";
import { User } from "../models/userModel.js";
import { uploadFilesToCloudinary, deletFilesFromCloudinary } from '../utils/features.js';

// Get a property by ID
const getProperty = TryCatch(async (req, res, next) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId).populate("uploaded_by");
  if (!property) return next(new ErrorHandler("Property not found", 404));

  res.status(200).json({
    success: true,
    message: "Property fetched successfully",
    property,
  });
});

// Get liked properties by user
const getLikedProperty = TryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate('likes');

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    message: "Liked properties fetched successfully",
    properties: user.likes,
  });
});

// Get latest properties
const getLatestProperty = TryCatch(async (req, res, next) => {
  const properties = await Property.find().sort({ createdAt: -1 }).limit(5);
  if (!properties) return next(new ErrorHandler("Properties not found", 404));

  res.status(200).json({
    success: true,
    message: "Latest properties fetched successfully",
    properties,
  });
});

const getTopCities = TryCatch(async (req, res, next) => {
  const cities = await Property.distinct("address.city");

  // Limit to top 5 manually
  const topCities = cities.slice(0, 5);

  res.status(200).json({
    success: true,
    message: "Top unique cities fetched successfully",
    cities: topCities,
  });
});



const getAgents = TryCatch(async (req, res, next) => {
  const agents = await User.find({ role: "admin" }); 
  res.status(200).json({
    success: true,
    message: "Agents fetched successfully",
    agents,
  });
});

const getSingleAgent = TryCatch(async (req, res, next) => {
     const agentId = req.params.id;

     const agent = await User.findById(agentId);

     if(!agent) return next(new ErrorHandler("Agent not found ",400))

     res.status(200).json({
          success: true,
          message: "agent fetched successfully",
          agent
     })
});

const getAgentProperty = TryCatch(async (req, res, next) => {
  const agentId = req.params.id;

  const agent = await User.findById(agentId);

  if(!agent) return next(new ErrorHandler("Agent not found ",400))

  const properties = await Property.find({ uploaded_by: agentId });

  if(!properties) return next(new ErrorHandler("properties not found",400));
  
  res.status(200).json({
        success: true,
        message: "properties feteched successfully",
        properties

  })

  
});


// Add new property
const addProperty = TryCatch(async (req, res, next) => {
  let {
    address,
    property_type,
    price,
    nums_bedrooms,
    nums_bathrooms,
    square_feet,
    status,
    usage_type,
    description,
    uploaded_by,
  } = req.body;

  if (typeof address === "string") address = JSON.parse(address);

  if (
    !address ||
    !property_type ||
    !price ||
    !nums_bedrooms ||
    !nums_bathrooms ||
    !square_feet ||
    !status ||
    !usage_type ||
    !description ||
    !uploaded_by
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const property_photos = req.files;
  if (property_photos.length < 1) {
    return next(new ErrorHandler("Please upload at least one photo", 400));
  }

  const photoURL = await uploadFilesToCloudinary(property_photos);

  const property = await Property.create({
    address,
    property_type,
    price,
    photos: photoURL || [],
    nums_bedrooms,
    nums_bathrooms,
    square_feet,
    status,
    usage_type,
    description,
    uploaded_by,
  });

  res.status(201).json({
    success: true,
    message: "Property added successfully",
    property,
  });
});

// Update property
const updateProperty = TryCatch(async (req, res, next) => {
  const propertyId = req.params.id;
  const { price, description, status, usage_type } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) return next(new ErrorHandler("Property not found", 404));;

  if(price)  property.price = price;
  if(description)   property.description = description;
  if(status)   property.status = status;
  if(usage_type)   property.usage_type = usage_type;

  await property.save();

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    property,
  });
});

// Delete property
const deleteProperty = TryCatch(async (req, res, next) => {
  const propertyId = req.params.id;

  const property = await Property.findById(propertyId);
  if (!property) return next(new ErrorHandler("Property not found", 404));

  const propertyPhotosPublicIds = property.photos.map(photo => photo.public_id);
  await deletFilesFromCloudinary(propertyPhotosPublicIds);

  await property.deleteOne();

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
});

// Like property
const likeProperty = TryCatch(async (req, res, next) => {
  const userId = req.params.uid;
  const propertyId = req.params.pid;

  const property = await Property.findById(propertyId);
  if (!property) return next(new ErrorHandler("Property not found", 404));

  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.likes.includes(propertyId)) {
    return next(new ErrorHandler("You have already liked this property", 400));
  }

  user.likes.push(propertyId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Property liked successfully",
    property,
  });
});

// Un-like property
const unLikeProperty = TryCatch(async (req, res, next) => {
  const userId = req.params.uid;
  const propertyId = req.params.pid;

  const property = await Property.findById(propertyId);
  if (!property) return next(new ErrorHandler("Property not found", 404));

  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const index = user.likes.indexOf(propertyId);
  if (index === -1) {
    return next(new ErrorHandler("Property not found in liked list", 404));
  }

  user.likes.splice(index, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Property unliked successfully",
    property,
  });
});

// Filtered property search
const getFilteredProperty = TryCatch(async (req, res, next) => {
  const { search, city, state, propertyType, usageType, maxPrice } = req.body;
  const page = Number(req.query.page) || 1;
  const limit = Number(process.env.PROPERTY_PER_PAGE) || 10;
  const skip = (page - 1) * limit;

  const baseQuery = {};
  if (search) {
    const regEx = new RegExp(search, "i");
  
    baseQuery["$or"] = [
      { "address.property_address": { $regex: regEx} }, 
      { description: { $regex: regEx} }
    ];
  }
   
  if (city) baseQuery["address.city"] = city;
  if (state) baseQuery["address.state"] = state;
  if (propertyType) baseQuery.property_type = propertyType;
  if (usageType) baseQuery.usage_type = usageType;
  if (maxPrice) {
    baseQuery.price = {};
    if (maxPrice) baseQuery.price.$lte = Number(maxPrice);
  }

  const [properties, totalCount] = await Promise.all([
    Property.find(baseQuery).limit(limit).skip(skip),
    Property.countDocuments(baseQuery),
  ]);

  const totalPage = Math.ceil(totalCount / limit) || 1;

  res.status(200).json({
    success: true,
    message: "Properties fetched successfully",
    properties,
    totalPage,
  });
});


const getAdminProperties = TryCatch(async (req, res, next) => {
  const { page = 1, keywords } = req.query;
  const limit = Number(process.env.PROPERTY_PER_PAGE) || 8;
  const skip = (Number(page) - 1) * limit;

  const baseQuery = {};

  // Apply regex search on all possible string fields
  if (keywords) {
    const regEx = new RegExp(keywords, "i");

    baseQuery["$or"] = [
      { "address.property_address": { $regex: regEx } },
      { "address.city": { $regex: regEx } },
      { "address.state": { $regex: regEx } },
      { description: { $regex: regEx } },
      { uploaded_by: { $regex: regEx } },
      { property_type: { $regex: regEx } },
      { usage_type: { $regex: regEx } },
      { status: { $regex: regEx } },
    ];
  }

  // Execute the search and count queries in parallel
  const [properties, totalCount] = await Promise.all([
    Property.find(baseQuery).limit(limit).skip(skip),
    Property.countDocuments(baseQuery),
  ]);

  const totalPage = Math.ceil(totalCount / limit) || 1;

  res.status(200).json({
    success: true,
    message: "Admin properties fetched successfully",
    properties,
    totalPage,
  });
});


// Add photo to property
const addPhoto = TryCatch(async (req, res, next) => {
  const propertyId = req.params.id;
  const property = await Property.findById(propertyId);
  if (!property) return next(new ErrorHandler("Property not found", 404));

  const photo = req.file;
  if (!photo) return next(new ErrorHandler("Please upload a photo", 400));
  if (property.photos.length >= 5) {
    return next(new ErrorHandler("Your photo limit is full", 400));
  }

  const photoURL = await uploadFilesToCloudinary([photo]);
  property.photos.push({
    public_id: photoURL[0].public_id,
    url: photoURL[0].url,
  });

  await property.save();

  res.status(200).json({
    success: true,
    message: "Photo added successfully",
    property,
  });
});

// Remove photo from property
const removePhoto = TryCatch(async (req, res, next) => {
  const propertyId = req.params.id;
  const { photoId } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) return next(new ErrorHandler("Property not found", 404));

  const photoIndex = property.photos.findIndex(photo => photo.public_id === photoId);
  if (photoIndex === -1) return next(new ErrorHandler("Photo not found", 404));

  await deletFilesFromCloudinary([photoId]);

  property.photos.splice(photoIndex, 1);
  await property.save();

  res.status(200).json({
    success: true,
    message: "Photo removed successfully",
    property,
  });
});

export {
  getProperty,
  getLatestProperty,
  likeProperty,
  unLikeProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  getLikedProperty,
  getFilteredProperty,
  addPhoto,
  removePhoto,
  getTopCities,
  getAgents,
  getSingleAgent,
  getAgentProperty,
  getAdminProperties
};

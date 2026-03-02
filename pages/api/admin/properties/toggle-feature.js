import { connectDB } from "@/lib/db";
import { Property } from "@/models/propertyModel";
import { withAuth } from "@/lib/middleware";

const handler = async (req, res) => {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await connectDB();

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  try {
    const { propertyId, featureType, value } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    // Validate feature type
    const validFeatureTypes = ["is_featured", "is_top_project", "is_premium"];
    if (!validFeatureTypes.includes(featureType)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid feature type. Must be one of: is_featured, is_top_project, is_premium",
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Update the feature flag
    property[featureType] =
      value !== undefined ? value : !property[featureType];
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${featureType.replace("is_", "").replace("_", " ")} status updated`,
      property: {
        _id: property._id,
        is_featured: property.is_featured,
        is_top_project: property.is_top_project,
        is_premium: property.is_premium,
      },
    });
  } catch (error) {
    console.error("Toggle feature error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update property",
    });
  }
};

export default withAuth(handler);

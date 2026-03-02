import { connectDB } from "@/lib/db";
import { Property } from "@/models/propertyModel";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await connectDB();

  try {
    const { city, limit = 10 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 10, 20);

    // Build query
    const baseQuery = { status: "available" };
    if (city) {
      baseQuery["address.city"] = { $regex: new RegExp(city, "i") };
    }

    // Fetch featured properties
    const featuredProperties = await Property.find({
      ...baseQuery,
      is_featured: true,
    })
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .select("-description -amenities")
      .populate("uploaded_by", "username phone");

    // Fetch top projects
    const topProjects = await Property.find({
      ...baseQuery,
      is_top_project: true,
    })
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .select("-description -amenities")
      .populate("uploaded_by", "username phone");

    // Fetch premium properties
    const premiumProperties = await Property.find({
      ...baseQuery,
      is_premium: true,
    })
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .select("-description -amenities")
      .populate("uploaded_by", "username phone");

    res.status(200).json({
      success: true,
      featuredProperties,
      topProjects,
      premiumProperties,
      counts: {
        featured: featuredProperties.length,
        topProjects: topProjects.length,
        premium: premiumProperties.length,
      },
    });
  } catch (error) {
    console.error("Fetch featured properties error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch featured properties",
    });
  }
}

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
    const { city, limit = 12, page = 1 } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 12, 1), 30);
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const query = { status: "available", is_project: true };
    if (city) {
      query["address.city"] = { $regex: new RegExp(`^${city}$`, "i") };
    }

    const projects = await Property.find(query)
      .sort({ is_premium: -1, createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .select("-description -amenities")
      .populate("uploaded_by", "username phone");

    res.status(200).json({
      success: true,
      projects,
      page: parsedPage,
      perPage: parsedLimit,
      count: projects.length,
    });
  } catch (error) {
    console.error("Fetch projects error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch projects",
    });
  }
}

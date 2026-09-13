import { connectDB } from "@/lib/db";
import { Insight } from "@/models/insightModel";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await connectDB();

  try {
    const insights = await Insight.find({ is_published: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, insights });
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch insights",
    });
  }
}

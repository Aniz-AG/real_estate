import { connectDB } from "@/lib/db";
import { Builder } from "@/models/builderModel";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await connectDB();

  try {
    const builders = await Builder.find({ "logo.url": { $exists: true, $ne: "" } })
      .select("name logo website")
      .sort({ name: 1 });

    res.status(200).json({ success: true, builders });
  } catch (error) {
    console.error("Error fetching builders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch builders",
    });
  }
}

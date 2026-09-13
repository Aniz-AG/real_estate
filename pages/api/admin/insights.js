import { connectDB } from "@/lib/db";
import { Insight } from "@/models/insightModel";
import { withAuth } from "@/lib/middleware";
import { uploadToCloudinary } from "@/lib/helpers";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getInsights(req, res) {
  const insights = await Insight.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, insights });
}

async function createInsight(req, res) {
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  const getField = (name) => {
    const value = fields[name];
    return Array.isArray(value) ? value[0] : value;
  };

  const title = getField("title");
  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  let thumbnail;
  const thumbnailFile = Array.isArray(files.thumbnail)
    ? files.thumbnail[0]
    : files.thumbnail;
  if (thumbnailFile && thumbnailFile.filepath) {
    const result = await uploadToCloudinary(thumbnailFile.filepath, "insights");
    thumbnail = { public_id: result.public_id, url: result.url };
    fs.unlink(thumbnailFile.filepath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }

  const insight = await Insight.create({
    title,
    description: getField("description") || "",
    link: getField("link") || "",
    thumbnail,
    is_published: getField("is_published") !== "false",
  });

  res.status(201).json({
    success: true,
    message: "Insight created successfully",
    insight,
  });
}

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      return await getInsights(req, res);
    } catch (error) {
      console.error("Error fetching insights:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch insights",
      });
    }
  } else if (req.method === "POST") {
    try {
      return await createInsight(req, res);
    } catch (error) {
      console.error("Error creating insight:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create insight",
      });
    }
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}

export default withAuth(handler, true); // Admin only

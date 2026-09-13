import { connectDB } from "@/lib/db";
import { Insight } from "@/models/insightModel";
import { withAuth } from "@/lib/middleware";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/helpers";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateInsight(req, res, id) {
  const insight = await Insight.findById(id);
  if (!insight) {
    return res.status(404).json({ success: false, message: "Insight not found" });
  }

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

  if (getField("title")) insight.title = getField("title");
  if (getField("description") !== undefined) insight.description = getField("description");
  if (getField("link") !== undefined) insight.link = getField("link");
  if (getField("is_published") !== undefined) {
    insight.is_published = getField("is_published") === "true";
  }

  const thumbnailFile = Array.isArray(files.thumbnail)
    ? files.thumbnail[0]
    : files.thumbnail;
  if (thumbnailFile && thumbnailFile.filepath) {
    if (insight.thumbnail?.public_id) {
      try {
        await deleteFromCloudinary(insight.thumbnail.public_id);
      } catch (e) {
        console.error("Error deleting old thumbnail:", e);
      }
    }
    const result = await uploadToCloudinary(thumbnailFile.filepath, "insights");
    insight.thumbnail = { public_id: result.public_id, url: result.url };
    fs.unlink(thumbnailFile.filepath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }

  await insight.save();

  res.status(200).json({
    success: true,
    message: "Insight updated successfully",
    insight,
  });
}

async function deleteInsight(req, res, id) {
  const insight = await Insight.findById(id);
  if (!insight) {
    return res.status(404).json({ success: false, message: "Insight not found" });
  }

  if (insight.thumbnail?.public_id) {
    try {
      await deleteFromCloudinary(insight.thumbnail.public_id);
    } catch (e) {
      console.error("Error deleting thumbnail:", e);
    }
  }

  await Insight.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Insight deleted successfully" });
}

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      return await updateInsight(req, res, id);
    } catch (error) {
      console.error("Error updating insight:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update insight",
      });
    }
  } else if (req.method === "DELETE") {
    try {
      return await deleteInsight(req, res, id);
    } catch (error) {
      console.error("Error deleting insight:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete insight",
      });
    }
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}

export default withAuth(handler, true); // Admin only

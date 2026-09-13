import { connectDB } from "@/lib/db";
import { Builder } from "@/models/builderModel";
import { withAuth } from "@/lib/middleware";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/helpers";
import { cacheDeleteByPrefix } from "@/lib/cache";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateBuilder(req, res, id) {
  const builder = await Builder.findById(id);
  if (!builder) {
    return res.status(404).json({ success: false, message: "Builder not found" });
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

  if (getField("name")) builder.name = getField("name");
  if (getField("website") !== undefined) builder.website = getField("website");
  if (getField("description") !== undefined) builder.description = getField("description");
  if (getField("phone") !== undefined) builder.phone = getField("phone");
  if (getField("email") !== undefined) builder.email = getField("email");
  if (getField("is_premium") !== undefined) {
    builder.is_premium = getField("is_premium") === "true";
  }

  const logoFile = Array.isArray(files.logo) ? files.logo[0] : files.logo;
  if (logoFile && logoFile.filepath) {
    if (builder.logo?.public_id) {
      try {
        await deleteFromCloudinary(builder.logo.public_id);
      } catch (e) {
        console.error("Error deleting old logo:", e);
      }
    }
    const result = await uploadToCloudinary(logoFile.filepath, "builders");
    builder.logo = { public_id: result.public_id, url: result.url };
    fs.unlink(logoFile.filepath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }

  await builder.save();
  cacheDeleteByPrefix(`builder:${id}:`);

  res.status(200).json({
    success: true,
    message: "Builder updated successfully",
    builder,
  });
}

async function deleteBuilder(req, res, id) {
  const builder = await Builder.findById(id);
  if (!builder) {
    return res.status(404).json({ success: false, message: "Builder not found" });
  }

  if (builder.logo?.public_id) {
    try {
      await deleteFromCloudinary(builder.logo.public_id);
    } catch (e) {
      console.error("Error deleting logo:", e);
    }
  }

  await Builder.findByIdAndDelete(id);
  cacheDeleteByPrefix(`builder:${id}:`);

  res.status(200).json({ success: true, message: "Builder deleted successfully" });
}

async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      return await updateBuilder(req, res, id);
    } catch (error) {
      console.error("Error updating builder:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update builder",
      });
    }
  } else if (req.method === "DELETE") {
    try {
      return await deleteBuilder(req, res, id);
    } catch (error) {
      console.error("Error deleting builder:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete builder",
      });
    }
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}

export default withAuth(handler, true); // Admin only

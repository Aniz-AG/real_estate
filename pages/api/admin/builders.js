import { connectDB } from "@/lib/db";
import { Builder } from "@/models/builderModel";
import { withAuth } from "@/lib/middleware";
import { uploadToCloudinary } from "@/lib/helpers";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getBuilders(req, res) {
  const builders = await Builder.find().sort({ name: 1 });
  res.status(200).json({ success: true, builders });
}

async function createBuilder(req, res) {
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

  const name = getField("name");
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Builder name is required" });
  }

  let logo;
  const logoFile = Array.isArray(files.logo) ? files.logo[0] : files.logo;
  if (logoFile && logoFile.filepath) {
    const result = await uploadToCloudinary(logoFile.filepath, "builders");
    logo = { public_id: result.public_id, url: result.url };
    fs.unlink(logoFile.filepath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
  }

  const builder = await Builder.create({
    name,
    logo,
    website: getField("website") || "",
    description: getField("description") || "",
    phone: getField("phone") || "",
    email: getField("email") || "",
    city: getField("city") || "",
    state: getField("state") || "",
  });

  res.status(201).json({
    success: true,
    message: "Builder created successfully",
    builder,
  });
}

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      return await getBuilders(req, res);
    } catch (error) {
      console.error("Error fetching builders:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch builders",
      });
    }
  } else if (req.method === "POST") {
    try {
      return await createBuilder(req, res);
    } catch (error) {
      console.error("Error creating builder:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create builder",
      });
    }
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}

export default withAuth(handler, true); // Admin only

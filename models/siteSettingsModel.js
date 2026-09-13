import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    address_line: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },

    phone: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    support_email: { type: String, trim: true, default: "" },
    office_hours: { type: String, trim: true, default: "" },

    social: {
      facebook: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      instagram: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      youtube: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", siteSettingsSchema);

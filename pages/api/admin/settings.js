import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/siteSettingsModel";
import { withAuth } from "@/lib/middleware";

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const settings = (await SiteSettings.findOne()) || {};
      return res.status(200).json({ success: true, settings });
    } catch (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch settings",
      });
    }
  }

  if (req.method === "PUT") {
    try {
      const {
        address_line,
        city,
        state,
        pincode,
        phone,
        whatsapp,
        email,
        support_email,
        office_hours,
        social,
        show_top_cities,
      } = req.body;

      const settings = await SiteSettings.findOneAndUpdate(
        {},
        {
          address_line,
          city,
          state,
          pincode,
          phone,
          whatsapp,
          email,
          support_email,
          office_hours,
          social,
          show_top_cities,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      return res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        settings,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update settings",
      });
    }
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}

export default withAuth(handler, true); // Admin only

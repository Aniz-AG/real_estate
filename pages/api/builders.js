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
    const { city } = req.query;
    const filter = { "logo.url": { $exists: true, $ne: "" } };
    if (city) {
      filter.city = new RegExp(`^${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    }

    let builders = await Builder.find(filter)
      .select("name logo website is_premium city")
      .sort({ is_premium: -1, name: 1 });

    // Fall back to all builders if too few are set to this city yet — avoids
    // the homepage carousel collapsing down to one repeated builder (or
    // disappearing entirely) while city data is still being filled in for
    // existing builders. A single city match isn't enough for a carousel to
    // look intentional rather than broken.
    const MIN_CITY_MATCHES = 4;
    let scoped = Boolean(city);
    if (city && builders.length < MIN_CITY_MATCHES) {
      scoped = false;
      builders = await Builder.find({ "logo.url": { $exists: true, $ne: "" } })
        .select("name logo website is_premium city")
        .sort({ is_premium: -1, name: 1 });
    }

    res.status(200).json({ success: true, builders, scoped });
  } catch (error) {
    console.error("Error fetching builders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch builders",
    });
  }
}

import { connectDB } from "@/lib/db";
import { Builder } from "@/models/builderModel";
import { Property } from "@/models/propertyModel";
import { cached } from "@/lib/cache";

// Builder storefronts are read-heavy and change rarely (an admin edits a
// builder or lists a new property occasionally), so a short server-side TTL
// cache absorbs bursts of concurrent visitors without hammering MongoDB, and
// premium builders — who get the most traffic — benefit the most from it.
const TTL_MS = 60 * 1000;
const PAGE_SIZE = 12;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { id, page = "1" } = req.query;
  const pageNumber = Math.max(parseInt(page) || 1, 1);

  await connectDB();

  try {
    const cacheKey = `builder:${id}:page:${pageNumber}`;
    const payload = await cached(cacheKey, TTL_MS, async () => {
      const builder = await Builder.findById(id).select(
        "name logo website description phone email is_premium city state",
      );
      if (!builder) return null;

      const skip = (pageNumber - 1) * PAGE_SIZE;
      const [properties, total] = await Promise.all([
        Property.find({ builder: id, status: "available" })
          .select(
            "title address photos price price_max price_text price_per_sqft price_unit bhk_type property_type usage_type possession_status is_project createdAt",
          )
          .sort({ is_premium: -1, createdAt: -1 })
          .skip(skip)
          .limit(PAGE_SIZE),
        Property.countDocuments({ builder: id, status: "available" }),
      ]);

      return {
        builder,
        properties,
        page: pageNumber,
        perPage: PAGE_SIZE,
        total,
        hasMore: skip + properties.length < total,
      };
    });

    if (!payload) {
      return res
        .status(404)
        .json({ success: false, message: "Builder not found" });
    }

    // Lets any CDN/reverse proxy in front also cache this response, which is
    // what actually protects the origin under a real concurrent-user spike.
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    res.status(200).json({ success: true, ...payload });
  } catch (error) {
    console.error("Error fetching builder storefront:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch builder",
    });
  }
}

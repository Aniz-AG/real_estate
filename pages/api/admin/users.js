import { connectDB } from "@/lib/db";
import { User } from "@/models/userModel";
import { withAuth } from "@/lib/middleware";

async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { page = 1, limit = 12, search = "" } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build search query
      const searchQuery = search
        ? {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        User.find(searchQuery)
          .select("-otp -otpExpiry")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .populate("likes", "title project_name address price photos"),
        User.countDocuments(searchQuery),
      ]);

      const buildInterestSummary = (user) => {
        const history = user.search_history || [];
        const cityCounts = {};
        const typeCounts = {};
        history.forEach((item) => {
          if (item.city) {
            cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
          }
          if (item.property_type) {
            typeCounts[item.property_type] =
              (typeCounts[item.property_type] || 0) + 1;
          }
        });

        const topCity =
          Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          null;
        const topType =
          Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          null;
        const lastSearch =
          history.length > 0 ? history[history.length - 1] : null;

        return {
          last_seen: user.last_seen || null,
          last_search_at: user.last_search_at || null,
          search_count: history.length,
          like_count: user.likes?.length || 0,
          top_city: topCity,
          top_type: topType,
          main_search: lastSearch
            ? {
                city: lastSearch.city || null,
                property_type: lastSearch.property_type || null,
                bhk_type: lastSearch.bhk_type || null,
                min_price: lastSearch.min_price || null,
                max_price: lastSearch.max_price || null,
                usage_type: lastSearch.usage_type || null,
                searched_at: lastSearch.created_at || null,
              }
            : null,
        };
      };

      const enrichedUsers = users.map((user) => {
        const plain = user.toObject();
        return {
          ...plain,
          activity_summary: buildInterestSummary(user),
        };
      });

      res.status(200).json({
        success: true,
        users: enrichedUsers,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch users" });
    }
  } else if (req.method === "PUT") {
    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res
          .status(400)
          .json({ success: false, message: "User ID and role are required" });
      }

      if (!["user", "admin"].includes(role)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }

      // Prevent changing own role
      if (userId === req.user._id.toString()) {
        return res
          .status(400)
          .json({ success: false, message: "Cannot change your own role" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true },
      ).select("-otp -otpExpiry");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update user" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }

      // Prevent deleting self
      if (id === req.user._id.toString()) {
        return res
          .status(400)
          .json({ success: false, message: "Cannot delete your own account" });
      }

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

export default withAuth(handler, true); // true = admin only

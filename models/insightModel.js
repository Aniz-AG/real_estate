import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },
    link: {
      type: String,
      trim: true,
    },
    is_published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Insight =
  mongoose.models.Insight || mongoose.model("Insight", insightSchema);

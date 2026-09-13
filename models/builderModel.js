import mongoose from "mongoose";

const builderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    logo: {
      public_id: { type: String },
      url: { type: String },
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Builder =
  mongoose.models.Builder || mongoose.model("Builder", builderSchema);

import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
      minlength: 10,
    },
    photo: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    likes: [
      {
        type: String,
        ref: "Property",
      },
    ],
    last_seen: {
      type: Date,
      default: null,
    },
    last_search_at: {
      type: Date,
      default: null,
    },
    search_history: [
      {
        city: { type: String },
        property_type: { type: String },
        bhk_type: { type: String },
        min_price: { type: Number },
        max_price: { type: Number },
        usage_type: { type: String },
        created_at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

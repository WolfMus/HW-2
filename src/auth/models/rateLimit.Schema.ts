import mongoose, { model } from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});

export const rateLimitModel = model("Rate Limit", rateLimitSchema);
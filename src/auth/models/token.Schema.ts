import mongoose, { model } from "mongoose";

const tokensSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

export const tokensModel = model("Tokens", tokensSchema);
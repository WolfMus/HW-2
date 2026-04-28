import mongoose, { model } from "mongoose";
import { Comment } from "../types/comments";

const commentsSchema = new mongoose.Schema<Comment>({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export const commentsModel = model("Comments", commentsSchema);
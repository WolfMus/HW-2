import mongoose, { model } from "mongoose";
import { Comment, likesInfoForComms } from "../types/comments.type";
import { CommentatorInfo } from "../types/commentUserInfo";

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

const likesInfoSchema = new mongoose.Schema<likesInfoForComms>({
  likesCount: { type: Number, required: true, default: 0 },
  dislikesCount: { type: Number, required: true, default: 0 },
  myStatus: { type: String, required: true, default: "None" },
});

const commentsSchema = new mongoose.Schema<Comment>({
  content: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: commentatorInfoSchema,
  createdAt: { type: Date, required: true },
  likesInfo: likesInfoSchema,
});

export const commentsModel = model("Comments", commentsSchema);
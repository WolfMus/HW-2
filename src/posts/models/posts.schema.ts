import mongoose, { model } from "mongoose";
import { Post } from "../types/posts";

const postsScheme = new mongoose.Schema<Post>({
  title: {type: String, required: true},
  shortDescription: {type: String, required: true},
  content: {type: String, required: true},
  blogId: {type: String, required: true},
  blogName: {type: String, required: true},
  createdAt: {type: Date, required: true},
})

export const PostsModel = model<Post>('Posts', postsScheme);
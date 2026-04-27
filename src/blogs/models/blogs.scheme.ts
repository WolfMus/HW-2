import mongoose, { model } from "mongoose";
import { Blog } from "../types/blogs";

export const blogsScheme = new mongoose.Schema<Blog>({
    name: { type: String, required: true, maxLength: 15},
    description: { type: String, required: true, maxLength: 500},
    websiteUrl: { type: String, required: true, maxLength: 100},
    createdAt: {type: Date, required: true},
    isMembership: {type: Boolean, required: true},
})

export const BlogsModel = model<Blog>("Blogs", blogsScheme);
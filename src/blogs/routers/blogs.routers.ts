import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-Blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog-.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";

export const blogsRouter = Router({});

blogsRouter
  .get("", getBlogListHandler)
  .get("/:blogsId", getBlogHandler)
  .post("", createBlogHandler)
  .put("/:blogsId", updateBlogHandler)
  .delete("/:blogsId", deleteBlogHandler)

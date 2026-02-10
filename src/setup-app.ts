import express, { Express } from "express";
import { db } from "./db/in-memory.db";
import { HttpStatus } from "./core/types/types";
import { blogsRouter } from "./blogs/routers/blogs.routers";
import { postsRouters } from "./posts/routers/posts.routers";
import { BLOGS_PATH, POSTS_PATH } from "./core/types/paths/paths";


export const setupApp = (app: Express) => {
  app.use(express.json());

  app.delete("/testing/all-data", (req, res) => {
    db.blogs = [];
    db.posts = [];
    res.sendStatus(HttpStatus.NoContent);
  })

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouters);

  return app;
};

import express, { Express } from "express";
import { db } from "./db/in-memory.db";
import { HttpStatus } from "./core/types/types";
import { blogsRouter } from "./blogs/routers/blogs.routers";
import { postsRouters } from "./posts/routers/posts.routers";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/types/paths/paths";
import { testingRouter } from "./testing/testing.routers";


export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(TESTING_PATH, testingRouter)
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouters);

  return app;
};

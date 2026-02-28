import express, { Express } from "express";
import { blogsRouter } from "./blogs/routers/blogs.routers";
import { postsRouters } from "./posts/routers/posts.routers";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths/paths";
import { testingRouter } from "./testing/testing.route";


export const setupApp = (app: Express) => {
  app.use(express.json());

  console.log('DEBUG: blogsRouter is defined?', !!blogsRouter); 
  console.log('DEBUG: BLOGS_PATH is:', BLOGS_PATH);

  app.use(TESTING_PATH, testingRouter)

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouters);

  return app;
};

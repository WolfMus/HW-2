import express, { Express } from "express";
import { blogsRouter } from "./blogs/routers/blogs.routers";
import { postsRouters } from "./posts/routers/posts.routers";
import {
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH,
  AUTH_PATH,
  COMMENT_PATH,
} from "./core/paths/paths";
import { testingRouter } from "./testing/testing.route";
import { usersRouter } from "./users/routers/users.router";
import { authRouter } from "./auth/routers/auth-login.router";
import { commentsRouter } from "./comments/routers/comments.router";
import cookieParser from "cookie-parser";

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());

  app.use(TESTING_PATH, testingRouter);

  app.use(AUTH_PATH, authRouter);

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouters);
  app.use(USERS_PATH, usersRouter);
  app.use(COMMENT_PATH, commentsRouter);

  return app;
};

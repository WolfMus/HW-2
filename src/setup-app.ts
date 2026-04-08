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
import cors from "cors";
import helmet from "helmet";

export const setupApp = (app: Express) => {
  app.set('trust proxy', true);
  app.use(cors());
  // Basic CSP with helmet
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.example.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  app.use(TESTING_PATH, testingRouter);

  app.use(AUTH_PATH, authRouter);

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouters);
  app.use(USERS_PATH, usersRouter);
  app.use(COMMENT_PATH, commentsRouter);

  return app;
};;

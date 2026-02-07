import express, { Express } from "express";
import { db } from "./db/in-memory.db";
import { HttpStatus } from "./core/types/types";
import { blogsRouter } from "./blogs/routers/blogs.routers";


export const setupApp = (app: Express) => {
  app.use(express.json());

  app.delete("/testing/all-data", (req, res) => {
    db.blogs = [];
    res.sendStatus(HttpStatus.NoContent);
  })

  app.use("/blogs", blogsRouter);

  return app;
};

import express, { Request, Response, Express } from "express";
import { db } from "./db/in-memory.db";
import { BlogViewModel } from "./blogs/types/blogs";
import { HttpStatus } from "./core/types/types";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.delete("/testing/all-data", (req,res) => {
    db.blogs = [];
    res.status(HttpStatus.NoContent).send(db.blogs);
  })

  //returns all blogs
  app.get("/blogs", (req, res) => {
    res.status(HttpStatus.Ok).send(db.blogs);
  });

  //return blog by id
  app.get(
    "/blogs/:blogsId",
    (req: Request<{ blogsId: string }, BlogViewModel>, res: Response) => {
      const blog = db.blogs.find((b) => b.id === req.params.blogsId);
      if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
      }
      res.status(HttpStatus.Ok).send(blog);
    },
  );

  // //creates new blog
  // app.post("/blogs", (req: Request, res: Response) => {
  //   // 2) создаем новый блог
  //   const newBlog: BlogViewModel = {
  //     id: new Date().toDateString(),
  //     name: req.body.name,
  //     description: req.body.description,
  //     websiteUrl: req.body.websiteUrl,
  //   };

  //   // 3) добавляем новый блог в БД
  //   db.blogs.push(newBlog);
  //   res.status(HttpStatus.Created).send(newBlog);
  // });

  

  return app;
};

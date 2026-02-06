import express, { Request, Response, Express } from "express";
import { db } from "./db/in-memory.db";
import { BlogViewModel } from "./blogs/types/blogs";
import { HttpStatus } from "./core/types/types";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('', (req,res) => {
    res.status(200).send('Hello world!');
  })

  app.delete("/testing/all-data", (req, res) => {
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

  //creates new blog
  app.post("/blogs", (req: Request, res: Response) => {
    // 1) проверяем на валидацию
    // 2) создаем новый блог
    const newBlog: BlogViewModel = {
      id: new Date().toDateString(),
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };

    // 3) добавляем новый блог в БД
    db.blogs.push(newBlog);
    res.status(HttpStatus.Created).send(newBlog);
  });

  //deletes blog by id 
  app.delete("/blogs/:blogsId", (req: Request, res: Response) => {
    const newBlogsArray = db.blogs.filter(b => b.id !== req.params.blogsId);
    if (newBlogsArray === db.blogs) {
      return res.status(HttpStatus.NotFound)
    }
    res.sendStatus(HttpStatus.NoContent)
  })
  

  return app;
};

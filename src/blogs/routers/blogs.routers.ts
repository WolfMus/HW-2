import { Router, Response } from "express";
import { db } from "../../db/in-memory.db";
import { BlogViewModel } from "../../blogs/types/blogs";
import {
  HttpStatus,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../core/types/types";
import { BlogInputModel } from "../../blogs/dto/blog-input.dto";
import { blogInputDtoValidation } from "../../blogs/validation/blogInputDtoValidation";
import { createErrorMessage } from "../../core/types/createErrorMessage";

export const blogsRouter = Router({});

blogsRouter
  //returns all blogs
  .get("", (req, res) => {
    res.status(HttpStatus.Ok).send(db.blogs);
  })

  //return blog by id
  .get(
    "/:blogsId",
    (
      req: RequestWithParamsAndBody<{ blogsId: string }, BlogViewModel>,
      res: Response<BlogViewModel>,
    ) => {
      const blog = db.blogs.find((b) => b.id === req.params.blogsId);
      if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
      }
      res.status(HttpStatus.Ok).send(blog);
    },
  )

  //creates new blog
  .post("", (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const errors = blogInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessage(errors));
    }

    const newBlog: BlogViewModel = {
      id: String(db.blogs.length + 1),
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };

    db.blogs.push(newBlog);
    res.status(HttpStatus.Created).send(newBlog);
  })

  //update existing blog by id
  .put(
    "/:blogsId",
    (
      req: RequestWithParamsAndBody<{ blogsId: string }, BlogInputModel>,
      res: Response,
    ) => {
      // 1) проверка на валидацию

      const blog = db.blogs.find((b) => b.id === req.params.blogsId);
      if (blog) {
        ((blog.name = req.body.name),
          (blog.description = req.body.description),
          (blog.websiteUrl = req.body.websiteUrl),
          res.sendStatus(HttpStatus.NoContent));
      } else {
        return res.sendStatus(HttpStatus.NotFound);
      }
    },
  )

  //deletes blog by id
  .delete(
    "/:blogsId",
    (req: RequestWithParams<{ blogsId: string }>, res: Response) => {
      const id = String(req.params.blogsId);
      const initialLength = db.blogs.length;

      db.blogs = db.blogs.filter((b) => b.id !== id);

      if (initialLength === db.blogs.length) {
        return res.sendStatus(HttpStatus.NotFound);
      }
      res.sendStatus(HttpStatus.NoContent);
    },
  );

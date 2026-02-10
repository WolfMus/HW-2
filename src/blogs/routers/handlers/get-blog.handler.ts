import { Request, Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogViewModel } from "../../types/blogs";
import { db } from "../../../db/in-memory.db";

export function getBlogHandler(
  req: RequestWithParamsAndBody<{ blogsId: string }, BlogViewModel>,
  res: Response<BlogViewModel>,
) {
  const blog = db.blogs.find((b) => b.id === req.params.blogsId);
  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound);
  }
  return res.status(HttpStatus.Ok).send(blog);
}

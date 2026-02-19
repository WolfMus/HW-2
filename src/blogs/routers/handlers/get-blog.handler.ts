import { Request, Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogViewModel } from "../../types/blogs";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function getBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogViewModel>,
  res: Response<BlogViewModel>,
) {
  const blog = await blogsRepository.findById(req.params.id);
  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound);
  }
  return res.status(HttpStatus.Ok).send(blog);
}

import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response,
) {
  
  const id = String(req.params.id);
  const blog = await blogsRepository.findById(id);
  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound);
  }
  const body = req.body;

  await blogsRepository.update(id, body);
  res.sendStatus(HttpStatus.NoContent);
}

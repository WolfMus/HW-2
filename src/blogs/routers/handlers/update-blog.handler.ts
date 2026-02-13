import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogsRepository } from "../../repositories/blogs.repository";

export function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response,
) {
  
  const id = String(req.params.id);
  const body = req.body;

  blogsRepository.update(id, body);
  res.sendStatus(HttpStatus.NoContent);
}

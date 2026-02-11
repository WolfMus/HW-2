import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogInputDtoValidation } from "../../validation/blogInputDtoValidation";
import { blogsRepository } from "../../repositories/blogs.repository";

export function updateBlogHandler(
  req: RequestWithParamsAndBody<{ blogsId: string }, BlogInputModel>,
  res: Response,
) {
  
  const errors = blogInputDtoValidation(req.body);
  if (errors.length > 0) {
    return res.status(HttpStatus.NotFound);
  }

  const id = String(req.params.blogsId);
  const body = req.body;

  blogsRepository.update(id, body);
  res.sendStatus(HttpStatus.NoContent);
}

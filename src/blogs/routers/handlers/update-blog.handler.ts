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
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    await blogsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

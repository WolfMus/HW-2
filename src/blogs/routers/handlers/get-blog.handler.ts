import { Request, Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { Blog } from "../../types/blogs";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function getBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, Blog>,
  res: Response,
) {
  try {

    const blog = await blogsRepository.findById(req.params.id);
    if (!blog) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).send(blog);
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
  
}

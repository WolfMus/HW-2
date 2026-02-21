import { Request, Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { Blog } from "../../types/blogs";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function getBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, Blog>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id)

    if (!blog) {
      res.status(HttpStatus.NotFound)
      .send(
        createErrorMessage([{ 
          message: "Blog not found", 
          field: 'id',
        }])
      )
      return;
    }

    return res.status(HttpStatus.Ok).send(mapToBlogViewModel(blog));
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
  
}

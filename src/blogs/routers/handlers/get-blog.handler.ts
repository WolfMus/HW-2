import { Request, Response } from "express";
import {
  HttpStatus,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
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

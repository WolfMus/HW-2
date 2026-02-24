import { Request, Response } from "express";
import {
  HttpStatus,
  RequestWithParams,
} from "../../../core/types/types";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { blogsServices } from "../../application/blogs-services";

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsServices.findByIdOrFail(id)

    return res.status(HttpStatus.Ok).send(mapToBlogViewModel(blog));
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
  
}

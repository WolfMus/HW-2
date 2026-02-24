import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogsRepository } from "../../repositories/blogs.repository";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { blogsServices } from "../../application/blogs-services";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response,
) {
  try {

    const id = req.params.id;
    const body = req.body;

    await blogsServices.update(id, body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

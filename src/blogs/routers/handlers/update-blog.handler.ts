import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogsRepository } from "../../repositories/blogs.repository";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response,
) {
  try {

    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
      return;
    }

    await blogsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

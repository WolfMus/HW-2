import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { Post } from "../../types/posts";

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, Post>,
  res: Response,
) {
  try {
    const blog = await blogsRepository.findById(req.body.blogId);
    if (!blog) {
      return res
        .status(HttpStatus.NotFound)
        .send(createErrorMessage([{ field: "id", message: "blog not found" }]));
    }

    const post = await postsRepository.findById(req.params.id);
    if (!post) {
      return res
        .status(HttpStatus.NotFound)
        .send(createErrorMessage([{ field: "id", message: "post not found" }]));
    }

    await postsRepository.update(req.params.id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

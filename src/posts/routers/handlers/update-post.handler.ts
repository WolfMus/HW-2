import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { Post } from "../../types/posts";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsService, postsService } from "../../../composition-root";

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, Post>,
  res: Response,
) {
  try {
    await blogsService.findById(req.body.blogId);
    await postsService.update(req.params.id, req.body);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

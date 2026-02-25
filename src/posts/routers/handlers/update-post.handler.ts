import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { Post } from "../../types/posts";
import { blogsServices } from "../../../blogs/application/blogs-services";
import { postsServices } from "../../application/posts-service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, Post>,
  res: Response,
) {
  try {
    await blogsServices.findByIdOrFail(req.body.blogId);
    await postsServices.update(req.params.id, req.body);
    
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { postsService } from "../../../composition-root";

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const post = await postsService.findById(req.params.id);
    const postToViewModel = mapToPostViewModel(post);

    return res.status(HttpStatus.Ok).send(postToViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

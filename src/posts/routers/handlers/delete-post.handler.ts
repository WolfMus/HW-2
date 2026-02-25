import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { postsServices } from "../../application/posts-service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    await postsServices.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

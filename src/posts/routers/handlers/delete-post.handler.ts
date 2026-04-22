import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { postsService } from "../../../composition-root";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    await postsService.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

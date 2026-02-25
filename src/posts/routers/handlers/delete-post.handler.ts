import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { postsServices } from "../../application/posts-service";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {

    await postsServices.findById(req.params.id);
    await postsServices.delete(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {

    const post = await postsRepository.findById(req.params.id);

    if (!post) {
      res.sendStatus(HttpStatus.NotFound);
    }

    await postsRepository.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

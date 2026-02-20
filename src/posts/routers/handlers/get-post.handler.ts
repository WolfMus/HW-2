import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";

export async function getPostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {

    const post = await postsRepository.findById(req.params.id);
    if (!post) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).send(post);
    
  } catch (e: unknown) {
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}

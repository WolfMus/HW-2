import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";

export function deletePostHandler(req: RequestWithParams<{ id: string }>, res: Response) {
  const id = req.params.id;
  const post = postsRepository.findById(id);
  
  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
  }

  postsRepository.delete(id);
  res.sendStatus(HttpStatus.NoContent);
}

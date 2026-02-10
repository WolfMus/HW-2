import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";

export function deletePostHandler(
  req: RequestWithParams<{ postId: string }>,
  res: Response,
) {
  const arrayLength = db.posts.length;
  const postsArray = db.posts.filter((p) => p.id !== req.params.postId);

  if (arrayLength === postsArray.length) {
    return res.sendStatus(HttpStatus.NotFound);
  }

  db.posts = postsArray;
  res.sendStatus(HttpStatus.NoContent);
}

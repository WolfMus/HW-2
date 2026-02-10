import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";

export function getPostHandler (req: RequestWithParams<{ postId: string }>, res: Response) {
    const post = db.posts.find((p) => p.id === req.params.postId);
    if (!post) {
      return res.sendStatus(HttpStatus.NotFound);
    }
    return res.status(HttpStatus.Ok).send(post);
  }
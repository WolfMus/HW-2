import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";
import { postsRepository } from "../../repository/posts.repository";

export function getPostHandler (req: RequestWithParams<{ postId: string }>, res: Response) {
    const id = req.params.postId;
    const post = postsRepository.findById(id);

    if (!post) {
      return res.sendStatus(HttpStatus.NotFound);
    }
    
    return res.status(HttpStatus.Ok).send(post);
  }
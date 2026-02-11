import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";

export function getPostListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
    return res.status(HttpStatus.Ok).send(posts);
  }
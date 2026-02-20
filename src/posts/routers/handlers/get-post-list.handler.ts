import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";

export async function getPostListHandler(req: Request, res: Response) {
  try {
    const posts = await postsRepository.findAll();
    return res.status(HttpStatus.Ok).send(posts);
  } catch (e: unknown) {
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}

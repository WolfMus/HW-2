import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postsRepository } from "../../repository/posts.repository";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";

export async function getPostListHandler(req: Request, res: Response) {
  try {

    const posts = await postsRepository.findAll();
    const postsToViewModel = posts.map(mapToPostViewModel)

    return res.status(HttpStatus.Ok).send(postsToViewModel);

  } catch (e: unknown) {
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}

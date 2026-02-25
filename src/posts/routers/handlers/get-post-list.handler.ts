import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";
import { postsServices } from "../../application/posts-service";

export async function getPostListHandler(req: Request, res: Response) {
  try {

    const posts = await postsServices.findAll();
    const postsToViewModel = posts.map(mapToPostViewModel)

    return res.status(HttpStatus.Ok).send(postsToViewModel);

  } catch (e: unknown) {
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}

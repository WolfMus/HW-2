import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";
import { blogsServices } from "../../../blogs/application/blogs.services";
import { postsServices } from "../../application/posts-service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function createPostHandler(
  req: RequestWithBody<PostInputModel>,
  res: Response,
) {
  try {

    const blog = await blogsServices.findByIdOrFail(req.body.blogId);

    const createdPost = await postsServices.create(req.body, blog);
    const postToViewModel = mapToPostViewModel(createdPost);

    res.status(HttpStatus.Created).send(postToViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

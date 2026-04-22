import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsService, postsService } from "../../../composition-root";

export async function createPostHandler(
  req: RequestWithBody<PostInputModel>,
  res: Response,
) {
  try {
    const blog = await blogsService.findById(req.body.blogId);

    const createdPostId = await postsService.create(req.body, blog);
    const post = await postsService.findById(createdPostId);
    const postToViewModel = mapToPostViewModel(post);

    res.status(HttpStatus.Created).send(postToViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

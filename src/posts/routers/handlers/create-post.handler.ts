import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";
import { blogsServices } from "../../../blogs/application/blogs.services";
import { postsServices } from "../../application/posts-service";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsQwRepository } from "../../../blogs/repositories/blogs-query.repository";
import { postsQwRepository } from "../../repository/posts-query.repository";

export async function createPostHandler(
  req: RequestWithBody<PostInputModel>,
  res: Response,
) {
  try {

    const blog = await blogsQwRepository.findById(req.body.blogId);

    const createdPostId = await postsServices.create(req.body, blog);
    const post = await postsQwRepository.findById(createdPostId)
    const postToViewModel = mapToPostViewModel(post);

    res.status(HttpStatus.Created).send(postToViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

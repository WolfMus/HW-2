import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { postsServices } from "../../../posts/application/posts-service";
import { mapToPostViewModel } from "../../../posts/routers/mapped/mapToPostViewModel";
import { PostInputForBlogModel } from "../../../posts/dto/post-input-for-blog.dto";
import { blogsQwRepository } from "../../repositories/blogs-query.repository";
import { postsQwRepository } from "../../../posts/repository/posts-query.repository";

export async function createPostForBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputForBlogModel>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsQwRepository.findById(id);

    const createdPostId = await postsServices.createForBlog(req.body, blog);
    const post = await postsQwRepository.findById(createdPostId);
    const postToViewModel = mapToPostViewModel(post);

    res.status(HttpStatus.Created).send(postToViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

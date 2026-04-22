import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { mapToPostViewModel } from "../../../posts/routers/mapped/mapToPostViewModel";
import { PostInputForBlogModel } from "../../../posts/dto/post-input-for-blog.dto";
import { blogsService, postsService } from "../../../composition-root";

export async function createPostForBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputForBlogModel>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsService.findById(id);

    const createdPostId = await postsService.createForBlog(req.body, blog);
    const post = await postsService.findById(createdPostId);
    const postToViewModel = mapToPostViewModel(post);

    res.status(HttpStatus.Created).send(postToViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

import { Request, Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { PostInputModel } from "../../../posts/dto/posts-input.dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsServices } from "../../application/blogs.services";
import { postsServices } from "../../../posts/application/posts-service";
import { mapToPostViewModel } from "../../../posts/routers/mapped/mapToPostViewModel";
import { PostInputForBlogModel } from "../../../posts/dto/post-input-for-blog.dto";

export async function createPostForBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, PostInputForBlogModel>,
  res: Response,
) {
    try {
        const id = req.params.id;
        const blog = await blogsServices.findByIdOrFail(id);

        const createdPost = await postsServices.createForBlog(req.body, blog);
        const postToViewModel = mapToPostViewModel(createdPost);

        res.status(HttpStatus.Created).send(postToViewModel);

    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}

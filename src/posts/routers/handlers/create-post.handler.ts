import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { Post } from "../../types/posts";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { postsRepository } from "../../repository/posts.repository";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function createPostHandler(
  req: RequestWithBody<PostInputModel>,
  res: Response,
) {
  try {

    const blog = await blogsRepository.findById(req.body.blogId);
    if (!blog) {
      return res.status(HttpStatus.BadRequest).send(
        createErrorMessage([
          {
            message: "BlogId not found",
            field: "blogId",
          },
        ]),
      );
    }

    const newPost: Post = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    const createdPost = await postsRepository.create(newPost);
    const postToViewModel = mapToPostViewModel(createdPost);

    res.status(HttpStatus.Created).send(postToViewModel);

  } catch (e: unknown) {
    console.log(e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

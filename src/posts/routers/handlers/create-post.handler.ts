import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { Post } from "../../types/posts";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { postsRepository } from "../../repository/posts.repository";
import { mapToPostViewModel } from "../mapped/mapToPostViewModel";

export async function createPostHandler(
  req: RequestWithBody<PostInputModel>,
  res: Response,
) {

  try {

    const blog = await blogsRepository.findById(req.body.blogId);
    
    if (!blog) {
      return res.status(HttpStatus.BadRequest).send({
        errorMessage: {
          message: "BlogId not found",
          field: "blogId",
        },
      });
    }
    
    const newPost: Post = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: blog.name,
    };
    
    const createdPost = await postsRepository.create(newPost);
    const mappedPost = mapToPostViewModel(createdPost);
    return res.status(HttpStatus.Created).send(mappedPost);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

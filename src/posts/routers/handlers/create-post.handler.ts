import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { db } from "../../../db/in-memory.db";
import { PostViewModel } from "../../types/posts";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { postsRepository } from "../../repository/posts.repository";

export function createPostHandler(
  req: RequestWithBody<PostInputModel>,
  res: Response,
) {
  const id = req.body.blogId;
  const blog = blogsRepository.findById(id);

  if (!blog) {
    return res.status(HttpStatus.BadRequest).send({
      errorMessage: {
        message: "BlogId not found",
        field: "blogId",
      },
    });
  }

  const newPost: PostViewModel = {
    id: String(db.posts.length ? Number(db.posts[db.posts.length - 1]!.id) + 1 : 1),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: blog.name,
  };

  postsRepository.create(newPost);
  return res.status(HttpStatus.Created).send(newPost);
}

import { Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { postsRepository } from "../../repository/posts.repository";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";

export function updatePostHandler (
      req: RequestWithParamsAndBody<{ id: string }, PostInputModel>,
      res: Response,
    ) {
      const id = req.params.id;
      const body = req.body;

      const blog = blogsRepository.findById(body.blogId)
      if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const post = postsRepository.findById(id);
      if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      postsRepository.update(post, body);

      return res.sendStatus(HttpStatus.NoContent);
    }
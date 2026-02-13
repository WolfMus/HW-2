import { Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { postInputDtoValidation } from "../../validation/postInputDtoValidation";
import { postsRepository } from "../../repository/posts.repository";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { createErrorMessage } from "../../../core/middlewares/validation/input-validation-result.middleware";

export function updatePostHandler (
      req: RequestWithParamsAndBody<{ postId: string }, PostInputModel>,
      res: Response,
    ) {

      const errors = postInputDtoValidation(req.body);
      if (errors.length > 0) {
        return res
          .status(HttpStatus.BadRequest)
          .send(createErrorMessage(errors));
      }

      const id = req.params.postId;
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
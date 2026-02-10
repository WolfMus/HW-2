import { Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { PostInputModel } from "../../dto/posts-input.dto";
import { postInputDtoValidation } from "../../validation/postInputDtoValidation";
import { createErrorMessage } from "../../../core/types/createErrorMessage";
import { db } from "../../../db/in-memory.db";

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

      const post = db.posts.find((p) => p.id === req.params.postId);
      if (!post) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      post.title = req.body.title;
      post.shortDescription = req.body.shortDescription;
      post.content = req.body.content;
      post.blogId = req.params.postId;

      return res.sendStatus(HttpStatus.NoContent);
    }
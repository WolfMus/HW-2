import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBodyAndUserId,
} from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { postsQwRepository } from "../../repository/posts-query.repository";
import { commentService } from "../../../comments/application/comments.service";
import { commentsQwRepository } from "../../../comments/repositories/comments-query.repository";
import { IdType } from "../../../core/types/id";

export async function createCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<{ id: string }, { content: string }, IdType>,
  res: Response,
) {
  try {
    const postId = req.params.id;
    const content = req.body.content;
    const userId = req.user?.id as string;

    const post = await postsQwRepository.findById(postId);

    const newCommentId = await commentService.create(
      content,
      post._id.toString(),
      userId,
    );

    const comment = await commentsQwRepository.getCommentById(newCommentId);

    res.status(HttpStatus.Created).send(comment);
  } catch (e) {
    errorsHandler(e, res);
  }
}

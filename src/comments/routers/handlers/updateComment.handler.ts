import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBodyAndUserId,
} from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsQueryRepo, commentsService } from "../../../composition-root";

export async function updateCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<
    { id: string },
    { content: string },
    { id: string }
  >,
  res: Response,
) {
  try {
    const commentId = req.params.id;
    const commentContent = req.body.content;
    const userId = req.user.id;

    const comment = await commentsQueryRepo.getCommentById(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      res.sendStatus(HttpStatus.Forbidden);
      return;
    }

    await commentsService.update(commentContent, commentId);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}

import { Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import {
  RequestWithParams,
  HttpStatus,
  RequestWithParamsAndBodyAndUserId,
  RequestWithParamsAndUserId,
} from "../../core/types/types";
import { CommentsService } from "../application/comments.service";

export class CommentsController {
  private commentsService: CommentsService;

  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async getCommentHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response,
  ) {
    try {
      const id = req.params.id;
      const comment = await this.commentsService.getById(id);
      res.status(HttpStatus.Ok).send(comment);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async updateCommentHandler(
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

      const comment = await this.commentsService.getById(commentId);
      if (comment.commentatorInfo.userId !== userId) {
        res.sendStatus(HttpStatus.Forbidden);
        return;
      }

      await this.commentsService.update(commentContent, commentId);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async deleteCommentHandler(
    req: RequestWithParamsAndUserId<{ id: string }, { id: string }>,
    res: Response,
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;
      const comment = await this.commentsService.getById(commentId);

      if (comment.commentatorInfo.userId !== userId) {
        return res.sendStatus(HttpStatus.Forbidden);
      }

      await this.commentsService.delete(commentId);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}

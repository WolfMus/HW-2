import { Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import {
  RequestWithParams,
  HttpStatus,
  RequestWithParamsAndBodyAndUserId,
  RequestWithParamsAndUserId,
} from "../../core/types/types";
import { CommentsService } from "../application/comments.service";
import { inject, injectable } from "inversify";
import { IdType } from "../../core/types/id";
import { LikesService } from "../../likes/application/likes.service";
import { LikeStatus } from "../types/likeComments.enum";
import { log } from "console";

@injectable()
export class CommentsController {

  constructor(
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(LikesService) protected likesService: LikesService,
  ) {}

  async getComment(
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

  async updateComment(
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

  async deleteComment(
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

  async updateCommentStatus(
    req: RequestWithParamsAndBodyAndUserId<{id: string}, { likeStatus: LikeStatus }, IdType>,
    res: Response
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;
      const likeStatus = req.body.likeStatus;

      // ЗАПИСЬ В КОЛЛЕКЦИЮ ЛАЙКОВ
      const likeId = await this.likesService.setStatus(commentId, userId, likeStatus);
      log(likeId);

      // УВЕЛИЧЕНИЕ СЧЕТЧИКА

    } catch (e) {
      errorsHandler(e, res);
    }
  }
}

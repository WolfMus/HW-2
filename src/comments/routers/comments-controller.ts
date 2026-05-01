import { Response } from "express";
import { errorsHandler } from "../../core/errors/errors.handler";
import {
  HttpStatus,
  RequestWithParamsAndBodyAndUserId,
  RequestWithParamsAndUserId,
} from "../../core/types/types";
import { CommentsService } from "../application/comments.service";
import { inject, injectable } from "inversify";
import { IdType } from "../../core/types/id";
import { LikesService } from "../../likes/application/likes.service";
import { LikeStatus } from "../types/likeComments.enum";
import { UsersQwRepository } from "../../users/repository/usersQw.repository";

@injectable()
export class CommentsController {

  constructor(
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(LikesService) protected likesService: LikesService,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
  ) {}

  async getComment(
    req: RequestWithParamsAndUserId<{ id: string }, IdType>,
    res: Response,
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.user?.id;

      const comment = await this.commentsService.getById(commentId, userId);
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

      const comment = await this.commentsService.getById(commentId, userId);

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
    req: RequestWithParamsAndUserId<{ id: string }, IdType>,
    res: Response,
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.user.id;

      // Получаем комментарий
      const comment = await this.commentsService.getById(commentId, userId);
      console.log(comment)
      // Находит userLogin
      const user = await this.usersQueryRepo.findById(userId);

      if (comment.commentatorInfo.userLogin !== user.login) {
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

      // Существует ли комментарий
      await this.commentsService.getById(commentId, userId);

      // Валидация статуса
      const likeStatus = await this.likesService.isValidStatus(req.body.likeStatus);
      
      // Стоял ли лайк
      let previousStatus = await this.likesService.previousStatus(commentId, userId)

      // Повторение реакции
      if (previousStatus === likeStatus) {
        return res.sendStatus(HttpStatus.NoContent);
      }

      // Удаление предыдущего запроса
      if (previousStatus) {
        await this.likesService.removeStatus(commentId, userId)
      }
      if (previousStatus === null){
        previousStatus = LikeStatus.None;
      }

      // Запись в коллекцию лайков
      await this.likesService.setStatus(commentId, userId, likeStatus);

      // Изменение счетчика
      await this.commentsService.changeStatus(commentId, likeStatus, previousStatus);

      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}

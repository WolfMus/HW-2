import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBodyAndUserId,
} from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { IdType } from "../../../core/types/id";
import {
  commentsQueryRepo,
  commentsService,
  postsService,
} from "../../../composition-root";

export async function createCommentHandler(
  req: RequestWithParamsAndBodyAndUserId<
    { id: string },
    { content: string },
    IdType
  >,
  res: Response,
) {
  try {
    const postId = req.params.id;
    const content = req.body.content;
    const userId = req.user?.id as string;

    const post = await postsService.findById(postId);

    const newCommentId = await commentsService.create(
      content,
      post._id.toString(),
      userId,
    );

    const comment = await commentsQueryRepo.getCommentById(newCommentId);

    res.status(HttpStatus.Created).send(comment);
  } catch (e) {
    errorsHandler(e, res);
  }
}

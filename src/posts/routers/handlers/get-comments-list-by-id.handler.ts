import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { CommentQueryDtoInput } from "../../../comments/types/commentQueryDtoInput";
import { HttpStatus } from "../../../core/types/types";
import { commentsQueryRepo, postsService } from "../../../composition-root";

export async function getListOfCommentsByIdHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await postsService.findById(id);

    const sanitizedQuery = matchedData(req, {
      includeOptionals: true,
    }) as CommentQueryDtoInput;
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const comments = await commentsQueryRepo.findByPostId(id, queryInput);
    res.status(HttpStatus.Ok).send(comments);
  } catch (e) {
    errorsHandler(e, res);
  }
}

import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { postsQwRepository } from "../../repository/posts-query.repository";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { commentsQwRepository } from "../../../comments/repositories/comments-query.repository";
import { CommentQueryDtoInput } from "../../../comments/types/commentQueryDtoInput";
import { HttpStatus } from "../../../core/types/types";

export async function getListOfCommentsByIdHandler (req: Request<{id: string}>, res: Response) {
    try {
        const id = req.params.id;
        await postsQwRepository.findById(id);

        const sanitizedQuery = matchedData(req, {includeOptionals: true}) as CommentQueryDtoInput;
        const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

        const comments = await commentsQwRepository.findByPostId(id, queryInput);
        res.status(HttpStatus.Ok).send(comments)
    } catch (e) {
        errorsHandler(e, res);
    }
}
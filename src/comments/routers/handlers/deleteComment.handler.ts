import { Response } from "express";
import { HttpStatus, RequestWithParamsAndUserId } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentService } from "../../application/comments.service";
import { commentsQwRepository } from "../../repositories/comments-query.repository";

export async function deleteCommentHandler(req: RequestWithParamsAndUserId<{id: string}, {id: string}>, res: Response) {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await commentsQwRepository.getCommentById(commentId);

        if (comment.commentatorInfo.userId !== userId) {
            return res.sendStatus(HttpStatus.Forbidden);
        }
        
        await commentService.delete(commentId);
        res.sendStatus(HttpStatus.NoContent)
    } catch (e) {
        errorsHandler(e, res);
    }
}
import { Response } from "express";
import { HttpStatus, RequestWithParamsAndUserId } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsQueryRepo, commentsService } from "../../../composition-root";

export async function deleteCommentHandler(req: RequestWithParamsAndUserId<{id: string}, {id: string}>, res: Response) {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await commentsQueryRepo.getCommentById(commentId);

        if (comment.commentatorInfo.userId !== userId) {
            return res.sendStatus(HttpStatus.Forbidden);
        }
        
        await commentsService.delete(commentId);
        res.sendStatus(HttpStatus.NoContent)
    } catch (e) {
        errorsHandler(e, res);
    }
}
import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { commentsQueryRepo } from "../../../composition-root";

export async function getCommentHandler(req: RequestWithParams<{id: string}>, res: Response) {
    try {
        const id = req.params.id;
        const comment = await commentsQueryRepo.getCommentById(id);
        res.status(HttpStatus.Ok).send(comment)
    } catch (e) {
        errorsHandler(e, res);
    }
}
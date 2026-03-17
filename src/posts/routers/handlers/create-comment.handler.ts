import { Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { postsQwRepository } from "../../repository/posts-query.repository";
import { jwtService } from "../../../auth/application/jwtService";
import { commentService } from "../../../comments/application/comments.service";

export async function createCommentHandler(req: RequestWithParamsAndBody<{id: string}, {content: string}>, res: Response) {
    try {
        const id = req.params.id;
        const content = req.body.content;
        const token = req.headers.authorization!.split(' ')[1];
        const userId = await jwtService.decodeToken(token!);

        const post = await postsQwRepository.findById(id);

        const newComment = await commentService.create(content, post._id.toString(), userId);
        res.status(HttpStatus.Created).send(newComment)

    } catch (e) {
        errorsHandler(e, res)
    }
}
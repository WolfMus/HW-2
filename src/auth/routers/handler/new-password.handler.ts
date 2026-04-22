import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function newPasswordHandler(req: RequestWithBody<{newPassword: string, recoveryCode: string}>, res: Response) {
    try {
        const newPassword = req.body.newPassword;
        const recoveryCode = req.body.recoveryCode;


        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}
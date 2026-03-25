import { Response } from "express";
import { HttpStatus, RequestWithBody, RequestWithQuery } from "../../../core/types/types";
import { ConfirmationCodeType } from "../../types/confirmation-code.type";
import { authService } from "../../application/authService";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function confirmationHandler(req: RequestWithBody<ConfirmationCodeType>, res: Response) {
    try {
    const code = req.body.code;

    await authService.checkConfirmationCode(code);

    res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
        errorsHandler(error, res);
    }   
}
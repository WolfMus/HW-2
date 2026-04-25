import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { authService } from "../../../composition-root";

export async function passwordRecoveryHandler(req: RequestWithBody<{email: string}>, res: Response) {
    try {
        const email = req.body.email;

        await authService.passwordRecovery(email);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
        errorsHandler(e, res);
    }
}
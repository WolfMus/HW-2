import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import {
  authService,
  emailService,
  usersQueryRepo,
} from "../../../composition-root";

export async function emailResendingHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  try {
    const email = req.body.email;

    const user = await usersQueryRepo.doesExistByLoginOrEmail(email);

    await authService.isConfirmed(user.id);

    const confirmationCode = await authService.updateConfirmationCodeForUser(
      user.id,
    );

    await emailService.sendEmail(email, confirmationCode);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}

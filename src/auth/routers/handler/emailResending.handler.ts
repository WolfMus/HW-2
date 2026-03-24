import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { nodeMailerService } from "../../application/nodeMailerService";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import { authService } from "../../application/authService";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function emailResendingHandler(
  req: RequestWithBody<{ email: string }>,
  res: Response,
) {
  try {
    const email = req.body.email;

    const user = await usersQwRepository.doesExistByLoginOrEmail(email);

    const confirmationCode = await authService.updateConfirmationCodeForUser(user._id.toString());

    await nodeMailerService.sendEmail(
      email,
      confirmationCode,
    );

    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}

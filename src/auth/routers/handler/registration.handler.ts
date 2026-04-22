import { Response } from "express";
import { UserInput } from "../../../users/type/user-input.interface";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { usersService } from "../../../composition-root";

export async function registrationHandler(
  req: RequestWithBody<UserInput>,
  res: Response,
) {
  try {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;

    await usersService.registerUser(login, email, password);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}

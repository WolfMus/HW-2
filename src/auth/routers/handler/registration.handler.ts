import { Response } from "express";
import { UserInput } from "../../../users/type/user-input.interface";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { userService } from "../../../users/application/users.service";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function registrationHandler(
  req: RequestWithBody<UserInput>,
  res: Response,
) {
  try {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;

    await userService.registerUser(login, email, password);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}

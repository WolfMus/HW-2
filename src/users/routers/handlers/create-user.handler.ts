import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { UserInput } from "../../type/user-input.interface";
import { userService } from "../../application/users.service";
import { usersQwRepository } from "../../repository/usersQw.repository";

export async function createUserHandler(
  req: RequestWithBody<UserInput>,
  res: Response,
) {
  try {
    const { login, password, email } = req.body;

    const userId = await userService.create(login, password, email);
    const user = await usersQwRepository.findById(userId);

    return res.status(HttpStatus.Created).send(user);
  } catch (e) {
    errorsHandler(e, res);
  }
}

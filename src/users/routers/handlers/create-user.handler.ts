import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { UserInput } from "../../type/user-input.interface";
import { usersQueryRepo, usersService } from "../../../composition-root";

export async function createUserHandler(
  req: RequestWithBody<UserInput>,
  res: Response,
) {
  try {
    const { login, password, email } = req.body;

    const userId = await usersService.create(login, password, email);
    const user = await usersQueryRepo.findById(userId);

    return res.status(HttpStatus.Created).send(user);
  } catch (e) {
    errorsHandler(e, res);
  }
}

import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import { IdType } from "../../../core/types/id";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function getInformationAboutUserHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  try {
  const userId = req.user.id;
  const me = await usersQwRepository.findById(userId);

  const meToView = {
    email: me.email,
    login: me.login,
    userId: me.id,
  };

  res.status(HttpStatus.Ok).send(meToView);
} catch (e) {
  errorsHandler(e, res);
}
}


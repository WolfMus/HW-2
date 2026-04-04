import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import { IdType } from "../../../core/types/id";

export async function getInformationAboutUserHandler(
  req: RequestWithUserId<IdType>,
  res: Response,
) {
  const userId = req.user.id;
  const me = await usersQwRepository.findById(userId);

  const meToView = {
    email: me.email,
    login: me.login,
    userId: me.id,
  };

  res.status(HttpStatus.Ok).send(meToView);
}


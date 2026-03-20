import { Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";

export async function getInformationAboutUserHandler(
  req: RequestWithUserId<{ id: string }>,
  res: Response,
) {
  const id = req.user.id;
  const me = await usersQwRepository.findById(id);

  const meToView = {
    email: me.email,
    login: me.login,
    userId: me.id,
  };

  res.status(HttpStatus.Ok).send(meToView);
}

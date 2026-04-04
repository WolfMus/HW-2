import { Request, Response } from "express";
import { HttpStatus, RequestWithUserId } from "../../../core/types/types";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import { jwtService } from "../../application/jwtService";

export async function getInformationAboutUserHandler(
  req: Request,
  res: Response,
) {
  const refreshToken = await jwtService.verifyRefreshToken(req.cookies.refreshToken);
  const me = await usersQwRepository.findById(refreshToken!.sub);

  const meToView = {
    email: me.email,
    login: me.login,
    userId: me.id,
  };

  res.status(HttpStatus.Ok).send(meToView);
}

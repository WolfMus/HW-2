import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { LoginInputModel } from "../../types/login-input.type";
import { usersQwRepository } from "../../../users/repository/usersQw.repository";
import bcrypt from 'bcrypt'

export async function authLoginHandler(
  req: RequestWithBody<LoginInputModel>,
  res: Response,
) {
  try {
    
    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;

    const user = await usersQwRepository.findLoginOrEmail(loginOrEmail);
    const passwordToHash = await bcrypt.hash(password, user!?.hash);

    if (user!.hash !== passwordToHash) {
        res.sendStatus(HttpStatus.Unauthorized);
    }

    res.sendStatus(HttpStatus.NoContent);
    
  } catch (e) {
    errorsHandler(e, res);
  }
}

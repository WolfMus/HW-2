import { Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { usersService } from "../../../composition-root";

export async function deleteUserHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    await usersService.delete(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e) {
    errorsHandler(e, res);
  }
}

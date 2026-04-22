import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsService } from "../../../composition-root";

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await blogsService.delete(id);
    return res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { blogsServices } from "../../application/blogs.services";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await blogsServices.delete(id);
    return res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

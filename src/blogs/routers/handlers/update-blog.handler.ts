import { Response } from "express";
import {
  HttpStatus,
  RequestWithParamsAndBody,
} from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsService } from "../../../composition-root";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputModel>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const body = req.body;

    await blogsService.update(id, body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsService } from "../../../composition-root";

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsService.findById(id);

    return res.status(HttpStatus.Ok).send(mapToBlogViewModel(blog));
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

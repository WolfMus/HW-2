import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    await blogsRepository.delete(id);
    return res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

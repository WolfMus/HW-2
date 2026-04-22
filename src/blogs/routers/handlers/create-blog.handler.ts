import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { blogsService } from "../../../composition-root";

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response,
) {
  try {
    const blogsId = await blogsService.create(req.body);
    const createdBlog = await blogsService.findById(blogsId);

    const blogToViewModel = mapToBlogViewModel(createdBlog);

    res.status(HttpStatus.Created).send(blogToViewModel);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

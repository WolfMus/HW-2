import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { blogsServices } from "../../application/blogs.services";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response,
) {
  try {

    const createdBlog = await blogsServices.create(req.body);
    const blogToViewModel = mapToBlogViewModel(createdBlog);
    res.status(HttpStatus.Created).send(blogToViewModel);
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

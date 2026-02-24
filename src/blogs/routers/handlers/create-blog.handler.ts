import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { Blog } from "../../types/blogs";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { blogsServices } from "../../application/blogs-services";

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response,
) {
  try {

    const createdBlog = await blogsServices.create(req.body);
    const blogToViewModel = mapToBlogViewModel(createdBlog);
    res.status(HttpStatus.Created).send(blogToViewModel);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

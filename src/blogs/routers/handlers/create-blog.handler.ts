import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { Blog } from "../../types/blogs";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";

export async function createBlogHandler(
  req: RequestWithBody<BlogInputModel>,
  res: Response,
) {
  try {
    
    const newBlog: Blog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };

    const createdBlog = await blogsRepository.create(newBlog);
    const blogToViewModel = mapToBlogViewModel(createdBlog);
    return res.status(HttpStatus.Created).send(blogToViewModel);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}

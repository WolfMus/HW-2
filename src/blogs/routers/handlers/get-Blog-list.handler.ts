import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    
    const blogs = await blogsRepository.findAll();
    return res.status(HttpStatus.Ok).send(blogs);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }

}

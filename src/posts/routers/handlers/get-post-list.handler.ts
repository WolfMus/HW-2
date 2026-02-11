import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";

export function getPostListHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll();
    return res.status(HttpStatus.Ok).send(blogs);
  }
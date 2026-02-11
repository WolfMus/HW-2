import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";
import { blogsRepository } from "../../repositories/blogs.repository";

export function getBlogListHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll();
    return res.status(HttpStatus.Ok).send(blogs);
  }


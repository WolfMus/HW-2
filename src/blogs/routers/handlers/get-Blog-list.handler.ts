import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";
import { blogsRepository } from "../../repositories/blogs.repository";

export async function getBlogListHandler(req: Request, res: Response) {
  const blogs = await blogsRepository.findAll();
    return res.status(HttpStatus.Ok).send(blogs);
  }


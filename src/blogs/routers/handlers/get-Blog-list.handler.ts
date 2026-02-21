import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { blogsRepository } from "../../repositories/blogs.repository";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    
    const blogs = await blogsRepository.findAll();
    const blogsToViewModel = blogs.map(mapToBlogViewModel);
    res.status(HttpStatus.Ok).send(blogsToViewModel);

  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }

}

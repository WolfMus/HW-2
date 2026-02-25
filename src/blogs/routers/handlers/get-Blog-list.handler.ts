import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { blogsServices } from "../../application/blogs-services";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { errorsHandler } from "../../../core/errors/errors.handler";

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    const blogs = await blogsServices.findMany();
    const blogsToViewModel = blogs.map(mapToBlogViewModel);
    
    res.status(HttpStatus.Ok).send(blogsToViewModel);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }

}

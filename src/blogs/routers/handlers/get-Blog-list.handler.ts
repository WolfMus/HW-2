import { Request, Response } from "express";
import { HttpStatus, RequestWithQuery } from "../../../core/types/types";
import { blogsServices } from "../../application/blogs.services";
import { mapToBlogViewModel } from "../mappers/mapToBlogViewModel";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { BlogsQueryDtoInput } from "../../input/blogs-query.input";
import { mapToBlogsListPaginatedOutput } from "../mappers/mapToBlogsListPaginatedOutput";
import { matchedData } from "express-validator";

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    
    const queryInput = matchedData(req.query) as BlogsQueryDtoInput;

    const { items, totalCount } = await blogsServices.findMany(queryInput);
    const blogsListOutput = mapToBlogsListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    
    res.status(HttpStatus.Ok).send(blogsListOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }

}

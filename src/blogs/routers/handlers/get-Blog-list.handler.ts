import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { BlogsQueryDtoInput } from "../../input/blogs-query.input";
import { mapToBlogsListPaginatedOutput } from "../mappers/mapToBlogsListPaginatedOutput";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { blogsService } from "../../../composition-root";

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    const sanitizedQuery = matchedData(req, {
      includeOptionals: true,
    }) as BlogsQueryDtoInput;
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await blogsService.findAll(queryInput);
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

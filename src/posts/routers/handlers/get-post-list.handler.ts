import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postsServices } from "../../application/posts-service";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { mapToPostsListPaginatedOutput } from "../mapped/mapToPostListPaginatedOutput";
import { PostsQueryDtoInput } from "../../input/post-query.input";

export async function getPostListHandler(req: Request, res: Response) {
  try {
    const sanitizedQuery = matchedData(req, {includeOptionals: true}) as PostsQueryDtoInput;
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsServices.findAll(queryInput);
    const postsListOutput = mapToPostsListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    })

    return res.status(HttpStatus.Ok).send(postsListOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

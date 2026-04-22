import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { matchedData } from "express-validator";
import { PostsQueryDtoInput } from "../../../posts/input/post-query.input";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { mapToPostsListPaginatedOutput } from "../../../posts/routers/mapped/mapToPostListPaginatedOutput";
import { HttpStatus } from "../../../core/types/types";
import { blogsService, postsService } from "../../../composition-root";

export async function getPostListForBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await blogsService.findById(id);

    const sanitizedQuery = matchedData(req, {
      includeOptionals: true,
    }) as PostsQueryDtoInput;
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await postsService.findByBlogId(
      id,
      queryInput,
    );
    const postsListOutput = mapToPostsListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok).send(postsListOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}

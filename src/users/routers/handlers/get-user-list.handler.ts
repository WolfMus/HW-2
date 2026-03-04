import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/types";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { usersQwRepository } from "../../repository/usersQw.repository";
import { UsersQueryInput } from "../../input/users-query.input";

export async function getUsersListHandler(req: Request, res: Response) {
  try {

    const sanitizedQuery = matchedData(req, {includeOptionals: true}) as UsersQueryInput;
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await usersQwRepository.findAll(queryInput);
    const usersListOutput = mapToUsersListPaginatedOutput(items, {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
    })
    return HttpStatus.Ok;

  } catch (e) {
    errorsHandler(e, res);
  }
}

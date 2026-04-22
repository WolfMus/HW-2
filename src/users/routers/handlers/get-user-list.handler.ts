import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/types/types";
import { matchedData } from "express-validator";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/heplers/set-default-sort-and-pagination";
import { UsersQueryInput } from "../../input/users-query.input";
import { Pagination } from "../../../core/types/pagination.interface";
import { UserView } from "../../type/user-view.interface";
import { usersQueryRepo } from "../../../composition-root";

export async function getUsersListHandler(
  req: Request,
  res: Response<Pagination<UserView[]>>,
) {
  try {

    const sanitizedQuery = matchedData(req, { includeOptionals: true }) as UsersQueryInput;
    
    const queryInput = {...setDefaultSortAndPaginationIfNotExist(sanitizedQuery)};

    const usersList = await usersQueryRepo.findAll(queryInput);
    return res.status(HttpStatus.Ok).send(usersList);
  } catch (e) {
    errorsHandler(e, res);
  }
}

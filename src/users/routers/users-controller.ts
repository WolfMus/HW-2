import { Request, Response } from "express";
import { Pagination } from "../../core/types/pagination.interface";
import { UserView } from "../type/user-view.interface";
import { matchedData } from "express-validator";
import { UsersQueryInput } from "../input/users-query.input";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/heplers/set-default-sort-and-pagination";
import { UsersQwRepository } from "../repository/usersQw.repository";
import {
  HttpStatus,
  RequestWithBody,
  RequestWithParams,
} from "../../core/types/types";
import { errorsHandler } from "../../core/errors/errors.handler";
import { UserInput } from "../type/user-input.interface";
import { UsersService } from "../application/users.service";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
    @inject(UsersService) protected usersService: UsersService
  ) {}

  async getUsersList(req: Request, res: Response<Pagination<UserView[]>>) {
    try {
      const sanitizedQuery = matchedData(req, {
        includeOptionals: true,
      }) as UsersQueryInput;

      const queryInput = {
        ...setDefaultSortAndPaginationIfNotExist(sanitizedQuery),
      };

      const usersList = await this.usersQueryRepo.findAll(queryInput);
      return res.status(HttpStatus.Ok).send(usersList);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async createUser(req: RequestWithBody<UserInput>, res: Response) {
    try {
      const { login, password, email } = req.body;

      const userId = await this.usersService.create(login, password, email);
      const user = await this.usersQueryRepo.findById(userId);

      res.status(HttpStatus.Created).send(user);
    } catch (e) {
      console.error(e);
      errorsHandler(e, res);
    }
  }

  async deleteUser(req: RequestWithParams<{ id: string }>, res: Response) {
    try {
      await this.usersService.delete(req.params.id);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e) {
      errorsHandler(e, res);
    }
  }
}

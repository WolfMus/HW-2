import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getUsersListHandler } from "./handlers/get-user-list.handler";
import { createUserHandler } from "./handlers/create-user.handler";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { adminAuthMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import {
  emailValidation,
  loginValidation,
  passwordValidation,
} from "../validation/password.validation";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { UsersSortField } from "../input/users-sort.input";
import { loginAndEmailValidation } from "../validation/searchTerm.validation";

export const usersRouter = Router({});
usersRouter
  .get(
    "",
    adminAuthMiddleware,
    loginAndEmailValidation,
    paginationAndSortingValidation(UsersSortField),
    inputValidationResultMiddleware,
    getUsersListHandler,
  )
  .post(
    "",
    adminAuthMiddleware,
    passwordValidation,
    emailValidation,
    loginValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );

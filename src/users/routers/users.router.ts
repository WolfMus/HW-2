import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { adminAuthMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import {
  emailValidation,
  loginValidation,
  passwordValidation,
} from "../validation/password.validation";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { UsersSortField } from "../input/users-sort.input";
import { loginAndEmailValidation } from "../validation/searchTerm.validation";
import { container } from "../../composition-root";
import { UsersController } from "./users-controller";

const usersController = container.get(UsersController);

export const usersRouter = Router({});
usersRouter
  .get(
    "",
    adminAuthMiddleware,
    loginAndEmailValidation,
    paginationAndSortingValidation(UsersSortField),
    inputValidationResultMiddleware,
    usersController.getUsersList.bind(usersController),
  )
  .post(
    "",
    adminAuthMiddleware,
    passwordValidation,
    emailValidation,
    loginValidation,
    inputValidationResultMiddleware,
    usersController.createUser.bind(usersController),
  )
  .delete(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    usersController.deleteUser.bind(usersController),
  );

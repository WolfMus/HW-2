import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { getUsersListHandler } from "./handlers/get-user-list.handler";
import { createUserHandler } from "./handlers/create-user.handler";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { UserSortField } from "../type/user-sort.enum";

export const usersRouter = Router({});
// paginationAndSortingValidation<UserSortField>, inputValidationResultMiddleware,
usersRouter
    .get("", getUsersListHandler)
    .post("", createUserHandler)
    .delete("/:id", idValidation, inputValidationResultMiddleware, deleteUserHandler)
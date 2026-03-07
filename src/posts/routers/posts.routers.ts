import { Router } from "express";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { postInputDtoValidation } from "../validation/postInputDtoValidation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { adminAuthMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { PostSortField } from "../input/post-sort-field";

export const postsRouters = Router({});

postsRouters
  .get(
    "",
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostListHandler,
  )
  .get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler)
  .post(
    "",
    adminAuthMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );

import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-Blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogsInputDtoValidation } from "../validation/blogsInputDtoValidation.middleware";
import { adminAuthMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { BlogSortField } from "../input/blog-sort-field";

export const blogsRouter = Router({});

blogsRouter

  .get(
    "",
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware, 
    getBlogListHandler)

  .get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler)

  .post(
    "",
    adminAuthMiddleware,
    blogsInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )

  .put(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    blogsInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )

  .delete(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );

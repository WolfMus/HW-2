import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogsInputDtoValidation } from "../validation/blogsInputDtoValidation.middleware";
import { adminAuthMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { BlogSortField } from "../input/blog-sort-field";
import { postInputDtoValidation } from "../../posts/validation/postInputDtoValidation.middleware";
import { PostSortField } from "../../posts/input/post-sort-field";
import { searchNameTermValidation } from "../validation/searchTerm.validation";
import { blogsController } from "../../composition-root";

export const blogsRouter = Router({});

blogsRouter

  .get(
    "",
    paginationAndSortingValidation(BlogSortField),
    searchNameTermValidation,
    inputValidationResultMiddleware,
    blogsController.getBlogList.bind(blogsController),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    blogsController.getBlog.bind(blogsController),
  )

  .get(
    "/:id/posts",
    idValidation,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    blogsController.getPostListForBlog.bind(blogsController),
  )

  .post(
    "",
    adminAuthMiddleware,
    blogsInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createBlog.bind(blogsController),
  )

  .post(
    "/:id/posts",
    idValidation,
    adminAuthMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createPostForBlog.bind(blogsController),
  )

  .put(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    blogsInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.updateBlog.bind(blogsController),
  )

  .delete(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogsController.deleteBlog.bind(blogsController),
  );

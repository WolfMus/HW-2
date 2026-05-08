import { Router } from "express";
import { postInputDtoValidation } from "../validation/postInputDtoValidation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { adminAuthMiddleware } from "../../auth/middleware/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { PostSortField } from "../input/post-sort-field";
import { CommentSortField } from "../../comments/types/commentSortField";
import { tokenGuard } from "../../auth/middleware/tokenGuard.guard";
import { commentsDtoValidation } from "../../comments/validation/commentsDtoValidation.middleware";
import { container } from "../../composition-root";
import { PostsController } from "./posts-controller";
import { optionalTokenGuard } from "../../auth/middleware/optional-tokenGuard.guard";

const postsController = container.get(PostsController)

export const postsRouters = Router({});

postsRouters
  .get(
    "",
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    postsController.getPostList.bind(postsController),
  )

  .get(
    "/:id",
    optionalTokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    postsController.getPost.bind(postsController),
  )

  .post(
    "",
    adminAuthMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPost.bind(postsController),
  )

  .put(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.updatePost.bind(postsController),
  )

  .delete(
    "/:id",
    adminAuthMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsController.deletePost.bind(postsController),
  )

  // COMMENTS
  .post(
    "/:id/comments",
    tokenGuard,
    idValidation,
    commentsDtoValidation,
    inputValidationResultMiddleware,
    postsController.createComment.bind(postsController),
  )

  .get(
    "/:id/comments",
    optionalTokenGuard,
    paginationAndSortingValidation(CommentSortField),
    idValidation,
    inputValidationResultMiddleware,
    postsController.getListOfCommentsById.bind(postsController),
  )

  // LIKES
  .post(
    "/:id/like-status",
    tokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    postsController.changeLikeStatus.bind(postsController),
  )

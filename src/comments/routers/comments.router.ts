import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { tokenGuard } from "../../auth/middleware/tokenGuard.guard";
import { commentsDtoValidation } from "../validation/commentsDtoValidation.middleware";
import { container } from "../../composition-root";
import { CommentsController } from "./comments-controller";

const commentsController = container.get(CommentsController);

export const commentsRouter = Router({});

commentsRouter
  // Get comm by id 
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    commentsController.getComment.bind(commentsController),
  )
  // Update comm
  .put(
    "/:id",
    tokenGuard,
    idValidation,
    commentsDtoValidation,
    inputValidationResultMiddleware,
    commentsController.updateComment.bind(commentsController),
  )
  // Delete comm
  .delete(
    "/:id",
    tokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.deleteComment.bind(commentsController),
  )
  // Like comm
  .put(
    "/:id/like-status",
    tokenGuard,
    idValidation, //добав
    inputValidationResultMiddleware,
    commentsController.updateCommentStatus.bind(commentsController),
  )

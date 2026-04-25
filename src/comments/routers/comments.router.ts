import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { tokenGuard } from "../../auth/middleware/tokenGuard.guard";
import { commentsDtoValidation } from "../validation/commentsDtoValidation.middleware";
import { commentsController } from "../../composition-root";

export const commentsRouter = Router({});

commentsRouter
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    commentsController.getCommentHandler.bind(commentsController),
  )
  .put(
    "/:id",
    tokenGuard,
    idValidation,
    commentsDtoValidation,
    inputValidationResultMiddleware,
    commentsController.updateCommentHandler.bind(commentsController),
  )
  .delete(
    "/:id",
    tokenGuard,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.deleteCommentHandler.bind(commentsController),
  );

import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getCommentHandler } from "./handlers/getComment.handler";
import { tokenGuard } from "../../auth/middleware/tokenGuard.guard";
import { commentsDtoValidation } from "../validation/commentsDtoValidation.middleware";
import { updateCommentHandler } from "./handlers/updateComment.handler";
import { deleteCommentHandler } from "./handlers/deleteComment.handler";

export const commentsRouter = Router({});

commentsRouter
    .get("/:id", idValidation, inputValidationResultMiddleware, getCommentHandler)
    .put("/:id", tokenGuard, idValidation, commentsDtoValidation, inputValidationResultMiddleware, updateCommentHandler)
    .delete("/:id", tokenGuard, idValidation, inputValidationResultMiddleware, deleteCommentHandler)
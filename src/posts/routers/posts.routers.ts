import { Router } from "express";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { postInputDtoValidation } from "../validation/postInputDtoValidation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";

export const postsRouters = Router({});

postsRouters
  .get("", getPostListHandler)
  .get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler)
  .post("", postInputDtoValidation, inputValidationResultMiddleware, createPostHandler)
  .put("/:id", idValidation, postInputDtoValidation, inputValidationResultMiddleware, updatePostHandler)
  .delete("/:id", idValidation, inputValidationResultMiddleware, deletePostHandler)
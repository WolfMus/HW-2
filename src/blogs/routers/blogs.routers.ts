import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-Blog-list.handler";
import { getBlogHandler }     from "./handlers/get-blog.handler";
import { createBlogHandler }  from "./handlers/create-blog.handler";
import { updateBlogHandler }  from "./handlers/update-blog.handler";
import { deleteBlogHandler }  from "./handlers/delete-blog.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { blogsInputDtoValidation } from "../validation/blogsInputDtoValidation.middleware";

export const blogsRouter = Router({});

blogsRouter

  .get("", getBlogListHandler)

  .get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler)

  .post("", blogsInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)

  .put("/:id", idValidation, blogsInputDtoValidation, inputValidationResultMiddleware, updateBlogHandler)

  .delete("/:id", idValidation, inputValidationResultMiddleware, deleteBlogHandler)

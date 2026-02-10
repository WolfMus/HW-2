import { Response } from "express";
import { HttpStatus, RequestWithParamsAndBody } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogInputDtoValidation } from "../../validation/blogInputDtoValidation";

export function updateBlogHandler(req: RequestWithParamsAndBody<{ blogsId: string }, BlogInputModel>,
      res: Response){
      const errors = blogInputDtoValidation(req.body);
        if (errors.length > 0) {
            return res.status(HttpStatus.NotFound);
        }

      const blog = db.blogs.find((b) => b.id === req.params.blogsId);
      if (blog) {
        ((blog.name = req.body.name),
          (blog.description = req.body.description),
          (blog.websiteUrl = req.body.websiteUrl),
          res.sendStatus(HttpStatus.NoContent));
      } else {
        return res.sendStatus(HttpStatus.NotFound);
      }
}
import { Response } from "express";
import { HttpStatus, RequestWithBody } from "../../../core/types/types";
import { BlogInputModel } from "../../dto/blog-input.dto";
import { blogInputDtoValidation } from "../../validation/blogInputDtoValidation";
import { createErrorMessage } from "../../../core/types/createErrorMessage";
import { BlogViewModel } from "../../types/blogs";
import { db } from "../../../db/in-memory.db";

export function createBlogHandler(req: RequestWithBody<BlogInputModel>, res: Response) {
    const errors = blogInputDtoValidation(req.body);
    
        if (errors.length > 0) {
          res.status(HttpStatus.BadRequest).send(createErrorMessage(errors));
        }
    
        const newBlog: BlogViewModel = {
          id: String(db.blogs.length + 1),
          name: req.body.name,
          description: req.body.description,
          websiteUrl: req.body.websiteUrl,
        };
    
        db.blogs.push(newBlog);
        return res.status(HttpStatus.Created).send(newBlog);
}
import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";
import { blogsRepository } from "../../repositories/blogs.repository";

  export function deleteBlogHandler(req: RequestWithParams<{ blogsId: string }>, res: Response) {
      const id = String(req.params.blogsId);
      const blog = blogsRepository.findById(id);

      if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      blogsRepository.delete(id);
      return res.sendStatus(HttpStatus.NoContent);
  }
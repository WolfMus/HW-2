import { Response } from "express";
import { HttpStatus, RequestWithParams } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";

  export function deleteBlogHandler(req: RequestWithParams<{ blogsId: string }>, res: Response) {
      const id = String(req.params.blogsId);
      const initialLength = db.blogs.length;

      db.blogs = db.blogs.filter((b) => b.id !== id);

      if (initialLength === db.blogs.length) {
        return res.sendStatus(HttpStatus.NotFound);
      }
      return res.sendStatus(HttpStatus.NoContent);
  }
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";

export function getBlogListHandler(req: Request, res: Response) {
    return res.status(HttpStatus.Ok).send(db.blogs);
  }


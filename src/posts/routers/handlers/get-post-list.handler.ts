import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { db } from "../../../db/in-memory.db";

export function getPostListHandler(req: Request, res: Response) {
    return res.status(HttpStatus.Ok).send(db.posts);
  }
import { Router } from "express";
import { HttpStatus } from "../core/types/types";
import { db } from "../db/in-memory.db";

export const testingRouter = Router({});
testingRouter
    .delete("/all-data", (req, res) => {
        db.blogs = [];
        db.posts = [];
        res.sendStatus(HttpStatus.NoContent);
      })
import { Request, Response, Router } from "express";
import { HttpStatus } from "../core/types/types";
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  tokensCollection,
  usersCollection,
} from "../db/mongo.db";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
    // usersCollection.deleteMany(),
    commentsCollection.deleteMany(),
    tokensCollection.deleteMany(),
  ]);

  res.sendStatus(HttpStatus.NoContent);
});

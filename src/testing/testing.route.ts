import { Request, Response, Router } from "express";
import { HttpStatus } from "../core/types/types";
import {
  blackListCollection,
  blogsCollection,
  commentsCollection,
  postsCollection,
  securityDeviceCollection,
  tokensCollection,
  usersCollection,
} from "../db/mongo.db";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
    usersCollection.deleteMany(),
    commentsCollection.deleteMany(),
    tokensCollection.deleteMany(),
    blackListCollection.deleteMany(),
    securityDeviceCollection.deleteMany(),
  ]);

  res.sendStatus(HttpStatus.NoContent);
});

import { Request, Response, Router } from "express";
import { HttpStatus } from "../core/types/types";
import { BlogsModel } from "../blogs/domain/blogs.model";
import { PostsModel } from "../posts/domain/posts.model";
import { usersModel } from "../users/models/users.schema";
import { commentsModel } from "../comments/models/comments.schema";
import { devicesModel } from "../security/models/device.Schema";
import { tokensModel } from "../auth/models/token.Schema";
import { rateLimitModel } from "../auth/models/rateLimit.Schema";
import { LikeForCommentModel } from "../likes/models/likeComments.schema";


export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await Promise.all([
    BlogsModel.deleteMany({}),
    PostsModel.deleteMany({}),
    usersModel.deleteMany({}),
    commentsModel.deleteMany({}),
    devicesModel.deleteMany({}),
    tokensModel.deleteMany({}),
    rateLimitModel.deleteMany({}),
    LikeForCommentModel.deleteMany({}),
  ]);

  res.sendStatus(HttpStatus.NoContent);
});

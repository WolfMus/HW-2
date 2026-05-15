import { Request, Response, Router } from "express";
import { HttpStatus } from "../core/types/types";
import { BlogsModel } from "../blogs/domain/blogs.model";
import { PostsModel } from "../posts/domain/posts.model";
import { UsersModel } from "../users/models/users.schema";
import { CommentsModel } from "../comments/models/comments.schema";
import { devicesModel } from "../security/models/device.Schema";
import { tokensModel } from "../auth/models/token.Schema";
import { rateLimitModel } from "../auth/models/rateLimit.Schema";
import { LikeForCommentModel } from "../likes/forComments/models/like-comments.schema";
import { LikesForPostModel } from "../likes/forPosts/models/like-posts.model";
import { BcryptService } from "../core/heplers/bcrypt-service";
import { LikeStatus } from "../likes/types/likeComments.enum";

export const testingRouter = Router({});
const bcryptService = new BcryptService();

testingRouter
  .delete("/all-data", async (req: Request, res: Response) => {
    await Promise.all([
      BlogsModel.deleteMany({}),
      PostsModel.deleteMany({}),
      UsersModel.deleteMany({}),
      CommentsModel.deleteMany({}),
      devicesModel.deleteMany({}),
      tokensModel.deleteMany({}),
      rateLimitModel.deleteMany({}),
      LikeForCommentModel.deleteMany({}),
      LikesForPostModel.deleteMany({}),
    ]);

    res.sendStatus(HttpStatus.NoContent);
  })

  .post("/addMockData", async (req: Request, res: Response) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const userInput1 = {
      login: "111",
      password: "qwerty",
      email: "1@email.com",
    }
    const saltAndHash1 = await bcryptService.generateHash(userInput1.password)
    const user1 = UsersModel.createUser(userInput1.login, userInput1.email, saltAndHash1)
    user1.save();

    const userInput2 = {
      login: "222",
      password: "qwerty",
      email: "2@email.com",
    }
    const saltAndHash2 = await bcryptService.generateHash(userInput2.password)
    const user2 = UsersModel.createUser(userInput2.login, userInput2.email, saltAndHash2)
    user2.save();

    const userInput3 = {
      login: "333",
      password: "qwerty",
      email: "3@email.com",
    }
    const saltAndHash3 = await bcryptService.generateHash(userInput3.password)
    const user3 = UsersModel.createUser(userInput3.login, userInput3.email, saltAndHash3)
    user3.save();

    const userInput4 = {
      login: "444",
      password: "qwerty",
      email: "4@email.com",
    }
    const saltAndHash4 = await bcryptService.generateHash(userInput4.password)
    const user4 = UsersModel.createUser(userInput4.login, userInput4.email, saltAndHash4)
    user4.save();

    const blogInput = {
      name: "TestBlog",
      description: "blog for testing",
      websiteUrl: "https://testing.com",
    };
    const blog = await BlogsModel.createBlog(blogInput);
    blog.save();

    const postInput = {
      title: "testPost",
      shortDescription: "post for testing",
      content: "testing testing testing",
      blogId: blog.id,
    };
    const post = PostsModel.createPost(postInput, blog.name);
    post.save();

    const like1 = LikesForPostModel.createLike(LikeStatus.Like, post.id, user1.id, user1.login);
    like1.save();
    await delay(1000);
    const like4 = LikesForPostModel.createLike(LikeStatus.Like, post.id, user4.id, user4.login);
    like4.save();
    await delay(1000);
    const like2 = LikesForPostModel.createLike(LikeStatus.Like, post.id, user2.id, user2.login);
    like2.save();
    await delay(1000);
    const like3 = LikesForPostModel.createLike(LikeStatus.Like, post.id, user3.id, user3.login);
    like3.save();

    res.sendStatus(HttpStatus.Created);
  });

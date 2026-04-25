import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { PostInputModel } from "../../../src/posts/dto/posts-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { clearDb } from "../../utils/clear-db";
import { runDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { createPost } from "../../utils/posts/create-post";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { createBlog } from "../../utils/blogs/create-blog";
import { createPostsDto } from "../../utils/posts/create-post-dto";
import { getPostId } from "../../utils/posts/get-post-by-id";
import { updatePost } from "../../utils/posts/update-post";
import { Post } from "../../../src/posts/types/posts";
import { getBlogById } from "../../utils/blogs/get-blog-id";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  const testPostsData: PostInputModel = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
  };

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it("✅ should create new post; POST /posts", async () => {
    const blog = await createBlog(app);

    const newPost: Post = {
      ...createPostsDto(),
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date(),
    };
    await createPost(app, newPost);
  });

  it("✅ should return all posts; GET /posts", async () => {
    const blog = await createBlog(app);

    const newPost: PostInputModel = {
      ...createPostsDto(),
      blogId: blog.id,
    };
    await createPost(app, newPost);

    await request(app).get("/posts").expect(HttpStatus.Ok);
  });

  it("✅ should return post by id; GET /posts/:postId", async () => {
    const blog = await createBlog(app);

    const newPost: PostInputModel = {
      ...createPostsDto(),
      blogId: blog.id,
    };
    const createdPost = await createPost(app, newPost);
    const post = await getPostId(app, createdPost.id);

    expect(post).toEqual({
      ...createdPost,
      id: expect.any(String),
    });
  });

  it("✅ should delete post by id; DELETE /posts/:postId", async () => {
    const blog = await createBlog(app);
    const newPost: PostInputModel = {
      ...createPostsDto(),
      blogId: blog.id,
    };
    const createdPost = await createPost(app, newPost);

    const deletePost = await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .expect(HttpStatus.NotFound);
  });

  it("✅ should update post by id with InputModel; PUT /posts/:postId", async () => {
    const blog = await createBlog(app);
    const newPost: PostInputModel = {
      ...createPostsDto(),
      blogId: blog.id,
    };
    const createdPost = await createPost(app, newPost);

    const updatePostData: Post = {
      title: "new title",
      content: "new content",
      shortDescription: "new shortDescription",
      blogId: blog.id,
      blogName: blog.name,
      createdAt: createdPost.createdAt,
    };

    const updatedPost = await updatePost(app, createdPost.id, updatePostData);
    const getNewPost = await getPostId(app, createdPost.id);

    expect(getNewPost).toEqual({
      ...updatePostData,
      id: expect.any(String),
    });
  });
});

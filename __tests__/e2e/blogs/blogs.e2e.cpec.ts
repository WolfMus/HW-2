import request from "supertest";
import express, { response } from "express";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { PostInputModel } from "../../../src/posts/dto/posts-input.dto";
import {
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_PATH,
} from "../../../src/core/paths/paths";
import { clearDb } from "../../utils/clear-db";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { runDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { getBlogsDto } from "../../utils/blogs/get-blogs-dto";
import { createBlog } from "../../utils/blogs/create-blog";
import { Post } from "../../../src/posts/types/posts";
import { getBlogById } from "../../utils/blogs/get-blog-id";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  const testBlogsData: BlogInputModel = {
    name: "string",
    description: "string",
    websiteUrl:
      "https://Pc9DLvZWb1vvGQqhu2fLAqzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33H.by",
  };

  const testPostsData: PostInputModel = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "1",
  };

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it("✅ should create blog; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...getBlogsDto(),
      name: 'blablabla',
    };

    await createBlog(app, newBlog)
  });

  it("✅ should return all blogs; GET /blogs", async () => {
    await createBlog(app);
    await createBlog(app);

    await request(app)
      .get(BLOGS_PATH)
      .set("Authorization", adminToken)
      .expect(HttpStatus.Ok);
  });


  it("✅ should return blog by id; GET /blogs/:id", async () => {
    const createdBlog = await createBlog(app)

    const findBlogId = await getBlogById(app, createdBlog.id);

    expect(findBlogId).toEqual({
      ...createdBlog,
      id: expect.any(String),
    });
  });

  it("✅ should delete blog by id; DELETE /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .delete(`${BLOGS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);
  });

  it("✅ should update blog by id; PUT /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const updateResponse = await request(app)
      .put(`${BLOGS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .send({
        ...testBlogsData,
        name: "asdasd",
        description: "new Description",
        websiteUrl: "https://asdasda3a3ya3d3adja3jj3j3ajaskdgl.jfgfgnf",
      })
      .expect(HttpStatus.NoContent);
  });

  it("✅ should create new post; POST /posts", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testPostsData })
      .expect(HttpStatus.Created);
  });

  it("✅ should return post by id; GET /posts/:postId", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testPostsData });

    const getResponse = await request(app)
      .get(`${POSTS_PATH}/${createPost.body.id}`)
      .expect(HttpStatus.Ok);
  });

  it("✅ should delete post by id; DELETE /posts/:postId", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const createPost = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testPostsData })
      .expect(HttpStatus.Created);

    const checkPost = await request(app)
      .get(`${POSTS_PATH}/${createPost.body.id}`)
      .expect(HttpStatus.Ok);

    const deletePost = await request(app)
      .delete(`${POSTS_PATH}/${createPost.body.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);
  });

  it("✅ should update post by id with InputModel; PUT /posts/:postId", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testPostsData });

    const updatePost = await request(app)
      .put(`${POSTS_PATH}/${createPost.body.id}`)
      .set("Authorization", adminToken)
      .send({ ...testPostsData })
      .expect(HttpStatus.NoContent);
  });
});

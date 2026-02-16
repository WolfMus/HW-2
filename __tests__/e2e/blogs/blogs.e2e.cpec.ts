import request from "supertest";
import express, { response } from "express";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { PostInputModel } from "../../../src/posts/dto/posts-input.dto";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "../../../src/core/paths/paths";
import { clearDb } from "../../utils/clear-db";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";

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
    const response = clearDb;
    // response.on("close", () => {});
  });

  it("should return all blogs; GET /blogs", async () => {
    await request(app)
      .get(BLOGS_PATH)
      .set("Authorization", adminToken)
      .expect(HttpStatus.Ok);
  });

  it("should create blog; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...testBlogsData,
      name: "string",
      description: "string",
      websiteUrl:
        "https://Pc9DLvZWb1vvGQqhu2fLAqq6jLFb3YqvPrpq2Sypa4JezzhaZLURIWHsXj2XH7Id3qR1gA.by",
    };

    await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.Created);
  });

  it("should return blog by id; GET /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`${BLOGS_PATH}/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(String),
    });
  });

  it("should delete blog by id; DELETE /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .delete(`${BLOGS_PATH}/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent);
  });

  it("should update blog by id; PUT /blogs/:id", async () => {
    const createResponse = await request(app)
      .post(BLOGS_PATH)
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const updateResponse = await request(app)
      .put(`${BLOGS_PATH}/${createResponse.body.id}`)
      .send({
        ...testBlogsData,
        name: "asdasd",
        description: "new Description",
        websiteUrl: "https://asdasda3a3ya3d3adja3jj3j3ajaskdgl.jfgfgnf",
      })
      .expect(HttpStatus.NoContent);
  });

  it("should create new post; POST /posts", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .send({ ...testPostsData })
      .expect(HttpStatus.Created);
  });

  it("should return post by id; GET /posts/:postId", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .send({ ...testPostsData });

    const getResponse = await request(app)
      .get(`${POSTS_PATH}/${createPost.body.id}`)
      .expect(HttpStatus.Ok);
  });

  it("should delete post by id; DELETE /posts/:postId", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .send({ ...testPostsData });

    const deletePost = await request(app)
      .delete(`${POSTS_PATH}/${createPost.body.id}`)
      .expect(HttpStatus.NoContent);
  });

  it("should update post by id with InputModel; PUT /posts/:postId", async () => {
    const createBlog = await request(app)
      .post(BLOGS_PATH)
      .send({ ...testBlogsData });

    const createPost = await request(app)
      .post(POSTS_PATH)
      .send({ ...testPostsData });

    const updatePost = await request(app)
      .put(`${POSTS_PATH}/${createPost.body.id}`)
      .send({...testPostsData})
      .expect(HttpStatus.NoContent)
  });
});

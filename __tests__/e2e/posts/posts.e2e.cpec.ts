import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { PostInputModel } from "../../../src/posts/dto/posts-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { clearDb } from "../../utils/clear-db";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const testPostsData: PostInputModel = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
  };

  beforeAll(async () => {
    const response = clearDb;
  });

  it("should return all posts; GET /posts", async () => {
    await request(app).get("/posts").expect(HttpStatus.Ok);
  });
});

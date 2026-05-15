import request from "supertest";
import express from "express";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { runDb, stopDb } from "../../../src/db/mongo.db";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import mongoose from "mongoose";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  const testBlogsData: BlogInputModel = {
    name: "string",
    description: "string",
    websiteUrl:
      "https://Pc9DLvZWb1vvGQqhu2fLAqq6jLFb3YqvPrpq2Sypa4JezzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33Hn081t",
  };

  beforeAll(async () => {
    // await runDb(SETTINGS.MONGO_URL);
    await mongoose.connect(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await clearDb(app);
    mongoose.connection.close();
    // await stopDb();
  });

  it("should return all blogs; GET /blogs", async () => {
    await request(app).get("/blogs").expect(HttpStatus.Ok);
  });

  it("❌ should NOT create blog with incorrect name; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...testBlogsData,
      name: null!,
    };

    await request(app)
      .post("/blogs")
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.BadRequest);
  });

  it("❌ shouldn't create blog with incorrect description; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...testBlogsData,
      description: null!,
    };

    await request(app)
      .post("/blogs")
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.BadRequest);
  });

  it("❌ shouldn't create blog with incorrect websiteUrl; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...testBlogsData,
      websiteUrl:
        "htttps://Pc9DLvZWb1vvGQqhu2fLAqq6jLFb3YqvPrpq2Sypa4JezzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33Hn081t",
    };

    await request(app)
      .post("/blogs")
      .set("Authorization", adminToken)
      .send(newBlog)
      .expect(HttpStatus.BadRequest);
  });

  it("❌ shouldn't return blog with incorrect id; POST /blogs:id", async () => {
    await request(app)
      .get(`${BLOGS_PATH}/507f1f77bcf86cd799439011`)
      .expect(HttpStatus.NotFound);
  });
});

import request from "supertest";
import express, { response } from "express";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { runDb } from "../../../src/db/mongo.db";

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
    await runDb(SETTINGS.MONGO_URL)
    await clearDb(app)
  });

  it("should return all blogs; GET /blogs", async () => {
    await request(app).get("/blogs").expect(HttpStatus.Ok);
  });

  it("❌ should NOT create blog with incorrect name; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...testBlogsData,
      name: null,
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
      description: null,
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
});

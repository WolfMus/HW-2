import request from "supertest";
import express, { response } from "express";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { clearDb } from "../../utils/clear-db";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { runDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { getBlogsDto } from "../../utils/blogs/get-blogs-dto";
import { createBlog } from "../../utils/blogs/create-blog";
import { getBlogById } from "../../utils/blogs/get-blog-id";
import { updateBlog } from "../../utils/blogs/update-blog";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it("✅ should create blog; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...getBlogsDto(),
      name: "blablabla",
    };

    await createBlog(app, newBlog);
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
    const createdBlog = await createBlog(app);

    const findBlogId = await getBlogById(app, createdBlog.id);

    expect(findBlogId).toEqual({
      ...createdBlog,
      id: expect.any(String),
    });
  });

  it("✅ should delete blog by id; DELETE /blogs/:id", async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .expect(HttpStatus.NotFound);
  });

  it("✅ should update blog by id; PUT /blogs/:id", async () => {
    const createdBlog = await createBlog(app);

    const blogUpdateData: BlogInputModel = {
      name: "new name",
      description: "new description",
      websiteUrl: "https://new-url.by",
    };

    await updateBlog(app, createdBlog.id, blogUpdateData);
    const getBlog = await getBlogById(app, createdBlog.id);

    expect(getBlog).toEqual({
      id: createdBlog.id,
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.isMembership,
    });
  });
});

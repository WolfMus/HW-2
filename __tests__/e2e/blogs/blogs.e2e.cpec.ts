import request from "supertest";
import express, { response } from "express";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";
import { getNameOfDeclaration } from "typescript";
import { create } from "node:domain";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const testBlogsData: BlogInputModel = {
    name: "string",
    description: "string",
    websiteUrl:
      "https://Pc9DLvZWb1vvGQqhu2fLAqq6jLFb3YqvPrpq2Sypa4JezzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33Hn081t",
  };

  beforeAll(async () => {
    const response = await request(app)
      .delete("/testing/all-data")
      .expect(HttpStatus.NoContent);

    response.on("close", () => {});
  });

  it("should say hi; GET /", async () => {
    await request(app).get("").expect(HttpStatus.Ok);
  });

  it("should return all blogs; GET /blogs", async () => {
    await request(app).get("/blogs").expect(HttpStatus.Ok);
  });

  it("should create blog; POST /blogs", async () => {
    const newBlog: BlogInputModel = {
      ...testBlogsData,
      name: "string",
      description: "string",
      websiteUrl:
        "https://Pc9DLvZWb1vvGQqhu2fLAqq6jLFb3YqvPrpq2Sypa4JezzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33Hn081t",
    };

    await request(app).post("/blogs").send(newBlog).expect(HttpStatus.Created);
  });

  it("should return blog by id; GET /blogs/:id", async () => {
    const createResponse = await request(app)
      .post("/blogs")
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/blogs/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(String),
    });
  });

  it("should delete blog by id; DELETE /blogs/;id", async () => {
    const createResponse = await request(app)
      .post("/blogs")
      .send({ ...testBlogsData })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .delete(`/blogs/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent)
  });
});

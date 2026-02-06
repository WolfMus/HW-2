import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { HttpStatus } from "../../../src/core/types/types";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  //   const testBlogsData: BlogInputModel = {
  //     name: "string",
  //     description: "string",
  //     websiteUrl:
  //       "https://Pc9DLvZWb1vvGQqhu2fLAqq6jLFb3YqvPrpq2Sypa4JezzhaZLURIWHsXj2XH7IYhkOaMVD-N2Jd3qR1gAuv33Hn081t",
  //   };

  beforeAll(async () => {
    await request(app).delete("testing/all-data").expect(HttpStatus.NoContent);
  });

  it("should return all blogs", async () => {
    await request(app).get("/blogs").expect(HttpStatus.Ok);
  });
});

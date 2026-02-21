import { Express } from "express";
import request from "supertest";
import { BlogInputModel } from "../../../src/blogs/dto/blog-input.dto";
import { getBlogsDto } from "./get-blogs-dto";
import { BLOGS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generate-admin-auth-token";
import { HttpStatus } from "../../../src/core/types/types";

const adminToken = generateAdminAuthToken();

export async function updateBlog(
  app: Express,
  blogId: string,
  blogsDto?: BlogInputModel,
): Promise<void> {
  const defaultBlogsData: BlogInputModel = getBlogsDto();
  const testBlogsData = { ...defaultBlogsData, ...blogsDto };

  console.log('DTO RECEIVED:', blogsDto); // Что пришло в функцию?
  console.log('FINAL PAYLOAD:', testBlogsData); // Что уходит на сервер?

  await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", adminToken)
    .send(testBlogsData)
    .expect(HttpStatus.NoContent);

  return;
}

import { Express } from "express";
import request from "supertest";
import { createPostsDto } from "./create-post-dto";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/types";
import { generateAdminAuthToken } from "../generate-admin-auth-token";
import { Post } from "../../../src/posts/types/posts";
import { WithId } from "mongodb";

const adminToken = generateAdminAuthToken();
export async function updatePost(
  app: Express,
  id: string,
  postDto?: Post,
): Promise<WithId<Post>> {
  const defaultPostData = createPostsDto();
  const testPostData = { ...defaultPostData, ...postDto };

  const updatePost = await request(app)
    .put(`${POSTS_PATH}/${id}`)
    .set("Authorization", adminToken)
    .send(testPostData)
    .expect(HttpStatus.NoContent);
  return updatePost.body;
}

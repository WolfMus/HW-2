import { Express } from "express";
import request from "supertest";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/types";

export async function getPostId(app: Express, id: string) {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${id}`)
    .expect(HttpStatus.Ok);

  return getResponse.body;
}

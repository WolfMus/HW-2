import request from "supertest";
import { generateAdminAuthToken } from "../generate-admin-auth-token";
import { Express } from "express";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/types";
import { UserInput } from "../../../src/users/type/user-input.interface";
import { UserView } from "../../../src/users/type/user-view.interface";

const adminToken = generateAdminAuthToken();

export async function createUser(app: Express, usersDto: UserInput): Promise<UserView> {
  const defaultUsersData = {
    login: "8TmlEd_xQ",
    password: "string",
    email: "example@example.dev",
  };
  const testUsersData: UserInput = { ...defaultUsersData, ...usersDto };

  const createResponse = await request(app)
    .post(`${USERS_PATH}`)
    .set("Authorization", adminToken)
    .send(testUsersData)
    .expect(HttpStatus.Created);

  return createResponse.body;
}

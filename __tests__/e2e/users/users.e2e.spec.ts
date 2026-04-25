import express from "express";
import { setupApp } from "../../../src/setup-app";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { runDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { clearDb } from "../../utils/clear-db";
import { UserInput } from "../../../src/users/type/user-input.interface";
import { createUser } from "../../utils/users/create-user";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/types";
import request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Users API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it("✅ should create users; POST /users", async () => {
    const newUser: UserInput = {
      login: "alex322",
      password: "hardpassword",
      email: "alex322@gmail.com",
    };

    await createUser(app, newUser);
  });

  it("✅ should return list of users; GET /users", async () => {
    const newUser1: UserInput = {
      login: "alex1",
      password: "hardpassword",
      email: "alex1@gmail.com",
    };
    const newUser2: UserInput = {
      login: "alex2",
      password: "hardpassword",
      email: "alex2@gmail.com",
    };
    const newUser3: UserInput = {
      login: "alex3",
      password: "hardpassword",
      email: "alex3@gmail.com",
    };
    await createUser(app, newUser1);
    await createUser(app, newUser2);
    await createUser(app, newUser3);
    await request(app)
      .get(USERS_PATH)
      .set("Authorization", adminToken)
      .expect(HttpStatus.Ok);
  });

  it("✅ should delete user by id; DELETE /users", async () => {
    const newUser: UserInput = {
      login: "alex",
      password: "hardpassword",
      email: "alex@gmail.com",
    };

    const createdUser = await createUser(app, newUser);

    await request(app)
      .delete(`${USERS_PATH}/${createdUser.id}`)
      .set("Authorization", adminToken)
      .expect(HttpStatus.NoContent);
  });
});

import express from "express";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import request from "supertest";
import { setupApp } from "../../../src/setup-app";
import { generateAdminAuthToken } from "../../utils/generate-admin-auth-token";
import { runDb, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { clearDb } from "../../utils/clear-db";
import {
  AUTH_PATH,
  SECURITY_PATH,
  USERS_PATH,
} from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/types";
import { nodeMailerService } from "../../../src/auth/application/nodeMailerService";

describe("Auth API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterEach(async () => {
    await clearDb(app);
  });

  afterAll(async () => {
    await clearDb(app);
    await stopDb();
  });

   it("Session test", async () => {
    // CREATE USER
    const userBody = {
      login: "alex",
      password: "qwerty",
      email: "alex@gmail.com",
    };
    const userCreated = await request(app)
      .post(`${USERS_PATH}`)
      .set("Authorization", adminToken)
      .send(userBody)
      .expect(HttpStatus.Created);

    // CREATE 4 SESSIONS
    const session_1 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "MacOS")
      .send({
        loginOrEmail: userBody.login,
        password: userBody.password,
      })
      .expect(HttpStatus.Ok);
    const session_2 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "Windows")
      .send({
        loginOrEmail: userBody.login,
        password: userBody.password,
      })
      .expect(HttpStatus.Ok);
    const session_3 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("User-Agent", "Linux")
      .send({
        loginOrEmail: userBody.login,
        password: userBody.password,
      })
      .expect(HttpStatus.Ok);
    const session_4 = await request(app)
      .post(`${AUTH_PATH}/login`)
      .set("user-agent", "Android")
      .send({
        loginOrEmail: userBody.login,
        password: userBody.password,
      })
      .expect(HttpStatus.Ok);

    // GET 4 REFRESH TOKENS
    const cookie_1 = session_1.headers["set-cookie"];
    const refreshToken_1 = cookie_1[0].split(";")[0].split("=")[1];
    const cookie_2 = session_2.headers["set-cookie"];
    const refreshToken_2 = cookie_2[0].split(";")[0].split("=")[1];
    const cookie_3 = session_3.headers["set-cookie"];
    const refreshToken_3 = cookie_3[0].split(";")[0].split("=")[1];
    const cookie_4 = session_4.headers["set-cookie"];
    const refreshToken_4 = cookie_4[0].split(";")[0].split("=")[1];

    // GET LIST OF SESSIONS
    const listOfSessions = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", `refreshToken=${refreshToken_1}`)
      .expect(HttpStatus.Ok);
    expect(listOfSessions.body).toHaveLength(4);

    // UPDATE REFRESH TOKEN 1
    const updateRT_1 = await request(app)
      .post(`${AUTH_PATH}/refresh-token`)
      .set("Cookie", `refreshToken=${refreshToken_1}`)
      .expect(HttpStatus.Ok);
    const refreshToken_1_new = updateRT_1.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
    expect(refreshToken_1_new).not.toBe(refreshToken_1);

    // DELETE SESSION WITH OLD TOKEN
    const deleteDevice_2_FAIL = await request(app)
      .delete(`${SECURITY_PATH}/devices/${listOfSessions.body[1].deviceId}`)
      .set("Cookie", `refreshToken=${refreshToken_1}`)
      .expect(HttpStatus.Unauthorized);

    // DELETE SESSION WITH NEW TOKEN
    const deleteDevice_2 = await request(app)
      .delete(`${SECURITY_PATH}/devices/${listOfSessions.body[1].deviceId}`)
      .set("Cookie", `refreshToken=${refreshToken_1_new}`)
      .expect(HttpStatus.NoContent);

    // GET LIST OF SESSIONS
    const listOfSessions_2 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", `refreshToken=${refreshToken_1_new}`)
      .expect(HttpStatus.Ok);
    expect(listOfSessions_2.body).toHaveLength(3);

    // LOGOUT FROM SESSION 3
    const session_3_logout = await request(app)
      .post(`${AUTH_PATH}/logout`)
      .set("Cookie", `refreshToken=${refreshToken_3}`)
      .expect(HttpStatus.NoContent);

    // LIST OF SESSIONS BY DEVICE 1
    const listOfSessions_3 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", `refreshToken=${refreshToken_1_new}`)
      .expect(HttpStatus.Ok);
    expect(listOfSessions_3.body).toHaveLength(2);

    const deleteAllSessions = await request(app)
      .delete(`${SECURITY_PATH}/devices`)
      .set("Cookie", `refreshToken=${refreshToken_1_new}`)
      .expect(HttpStatus.NoContent);

    const listOfSessions_4 = await request(app)
      .get(`${SECURITY_PATH}/devices`)
      .set("Cookie", `refreshToken=${refreshToken_1_new}`)
      .expect(HttpStatus.Ok);
    expect(listOfSessions_4.body).toHaveLength(1);
  }, 30000);

  it("should return 429 after 5 requests and 204 after 10s delay; /REGISTRATION", async () => {
    // REGISTER USER
    const userBody = {
      login: "user",
      password: "qwerty",
      email: "user@gmail.com",
    };
    // SEND 5 REQUESTS
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post(`${AUTH_PATH}/registration`)
        .send({
          login: `${userBody.login}${i}`,
          password: userBody.password,
          email: `${userBody.email}${i}`,
        });
    }

    const blockedRequest = await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send(userBody);

    expect(blockedRequest.status).toBe(HttpStatus.TooManyRequests);

    await new Promise((resolve) => setTimeout(resolve, 11000));

    const successRequest = await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send(userBody);

    expect(successRequest.status).toBe(HttpStatus.NoContent);
  }, 20000);

  it("Resending rate limit", async () => {
    // const spy = spyOn(nodeMailerService, 'sendEmail')

    // REGISTER USER
    const userRegistration = await request(app)
      .post(`${AUTH_PATH}/registration`)
      .send({
        login: "user",
        password: "qwerty",
        email: "user@gmail.com",
      })
      .expect(HttpStatus.NoContent);

    // EMAIL RESENDING
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post(`${AUTH_PATH}/registration-email-resending`)
        .send({
          email: `user@gmail.com`,
        });
    }

    const blockedRequest = await request(app)
      .post(`${AUTH_PATH}/registration-email-resending`)
      .send({
        email: `user@gmail.com`,
      });

    expect(blockedRequest.status).toBe(HttpStatus.TooManyRequests);

    await new Promise((resolve) => setTimeout(resolve, 11000));

    const successRequest = await request(app)
      .post(`${AUTH_PATH}/registration-email-resending`)
      .send({
        email: `user@gmail.com`,
      });

    expect(successRequest.status).toBe(HttpStatus.NoContent);
  }, 20000);
});

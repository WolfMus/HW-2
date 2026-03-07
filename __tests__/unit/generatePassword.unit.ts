import express from "express";
import { setupApp } from "../../src/setup-app";
import { runDb, usersCollection } from "../../src/db/mongo.db";
import { SETTINGS } from "../../src/core/settings/settings";
import { clearDb } from "../utils/clear-db";
import { createUser } from "../utils/users/create-user";
import { UserInput } from "../../src/users/type/user-input.interface";
import { bcryptService } from "../../src/core/heplers/bcrypt-service";

describe("UNIT TESTS", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await clearDb(app);
  });

  it("should create hash from password and compare", async () => {
    const newUser: UserInput = {
      login: "alex322",
      password: "hardpassword",
      email: "alex322@gmail.com",
    };
    const createdUser = await createUser(app, newUser);
    // const user = usersCollection.findOne({login: createdUser.login})

    const boolean = await bcryptService.checkPassword(newUser.password, createdUser.hash)
    expect(boolean === true);
  });
});

import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { User } from "../type/user.type";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";


const emailConfirmationSchema = new mongoose.Schema({
  confirmationCode: { type: String, required: true },
  expirationCode: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true },
});

interface UsersMethods {
  updatePassword(hash: string, salt: string): void;
  updateEmailConfirmStatus(status: boolean): void;
}

type UsersStatics = typeof UsersEntity;
type UsersModel = Model<User, unknown, UsersMethods> & UsersStatics;
export type UsersDocument = HydratedDocument<User, UsersMethods>;

const usersSchema = new mongoose.Schema<User>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, required: true },
  emailConfirmation: { type: emailConfirmationSchema, required: true },
});

class UsersEntity {
  private constructor(
    public login: string,
    public email: string,
    public hash: string,
    public salt: string,
    public createdAt: Date,
    public emailConfirmation: {
      confirmationCode: string,
      expirationCode: Date,
      isConfirmed: boolean,
    }, 
  ) {}

  static createUser(login: string, email: string, saltAndHash: {salt: string, hash: string}) {
    const user = new UsersModel({
      login: login,
      email: email,
      hash: saltAndHash.hash,
      salt: saltAndHash.salt,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationCode: add(new Date(), {
          minutes: 5,
        }),
        isConfirmed: false,
      },
    });
    return user;
  }

  async updateEmailConfirmStatus(status: boolean) {
    this.emailConfirmation.isConfirmed = status;
    return
  }

  async updatePassword(hash: string, salt: string) {
    this.hash = hash;
    this.salt = salt;
    return;
  }
}

usersSchema.loadClass(UsersEntity);
export const UsersModel = model<User, UsersModel>("Users", usersSchema);

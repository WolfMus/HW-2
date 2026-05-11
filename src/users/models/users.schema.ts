import mongoose, { HydratedDocument, Model, model } from "mongoose";
import { User } from "../type/user.type";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { BadRequestError } from "../../core/errors/bad-request.error";


const emailConfirmationSchema = new mongoose.Schema({
  confirmationCode: { type: String, required: true },
  expirationCode: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true, default: false },
});

const recoverySchema = new mongoose.Schema({
  recoveryCode: { type: String || null, required: false, default: null },
  recoveryCodeExpiration: { type: Date || null, required: false, default: null },
})

interface UsersMethods {
  updatePassword(hash: string, salt: string): void;

  updateConfirmCode(): string;
  updateConfirmationCodeStatus(): void;

  updateRecoveryCode(): string;
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
  recovery: { type: recoverySchema, required: true },
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
    public recovery: {
      recoveryCode: string | null,
      recoveryCodeExpiration: Date | null,
    }
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
      recovery: {
        recoveryCode: null,
        recoveryCodeExpiration: null,
      }
    });
    return user;
  }

  updatePassword(hash: string, salt: string) {
    this.hash = hash;
    this.salt = salt;
    return;
  }

  updateConfirmationCodeStatus() {
    // проверка даты
    if (!this.emailConfirmation.expirationCode || this.emailConfirmation.expirationCode < new Date()) {
      throw new BadRequestError("Bad Request", "expirationCode");
    }

    // Проверка существования кода
    if (!this.emailConfirmation.confirmationCode) {
      throw new BadRequestError("Bad Request", "confirmationCode");
    }
    
    // Проверка не подтвержден ли уже
    if (this.emailConfirmation.isConfirmed === true) {
      throw new BadRequestError("Bad Request", "isConfirmed");
    }

    this.emailConfirmation.isConfirmed = true;
    return;
  }

  updateConfirmStatus() {
    const confirmationCode = randomUUID();
    const expirationDate = add(new Date(), {
      minutes: 5,
    });
    this.emailConfirmation.confirmationCode = confirmationCode;
    this.emailConfirmation.expirationCode = expirationDate;
    return confirmationCode;
  }

  updateRecoveryCode() {
    const recoveryCode = randomUUID();
    const recoveryCodeExpiration = add(new Date(), {minutes: 15});
    this.recovery.recoveryCode = recoveryCode;
    this.recovery.recoveryCodeExpiration = recoveryCodeExpiration;
    return recoveryCodeExpiration;
  }
}

usersSchema.loadClass(UsersEntity);
export const UsersModel = model<User, UsersModel>("Users", usersSchema);

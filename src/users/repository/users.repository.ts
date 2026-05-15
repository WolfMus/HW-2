import { ObjectId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UserDbView } from "../type/user.db.interface";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { injectable } from "inversify";
import { UsersDocument, UsersModel } from "../models/users.schema";
import mongoose from "mongoose";

@injectable()
export class UsersRepository {
  async create(userInput: UserDbView): Promise<string> {
    const createdUser = await UsersModel.insertOne(userInput);
    return createdUser._id.toString();
  }

  async createByRegistration(userInput: UserDbView): Promise<string> {
    const createdUser = await UsersModel.insertOne(userInput);
    return createdUser._id.toString();
  }

  async findById(id: string): Promise<UsersDocument> {

    const user = await UsersModel.findById(id);
    if (!user) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return user
  }

  async findByLogin(login: string): Promise<UsersDocument> {
    const user = await UsersModel.findOne({login: login})
    return user!
  }

  async findByEmail(email: string): Promise<UsersDocument> {
    const user = await UsersModel.findOne({email: email})
    return user!
  }

  async findByConfirmationCode(code: string): Promise<UsersDocument> {
    const user = await UsersModel.findOne({"emailConfirmation.confirmationCode": code});
    if (!user) {
      throw new BadRequestError("Bad Request", "confirmationCode");
    }
    return user;
  }

  async findByRecoveryCode(recoveryCode: string): Promise<UsersDocument> {
    const user = await UsersModel.findOne({"recovery.recoveryCode": recoveryCode});
    if (!user) {
      throw new BadRequestError("Bad Request", "confirmationCode");
    }
    return user;
  }

  async save(user: UsersDocument): Promise<void> {
    await user.save();
    return;
  }

  async saveAndReturnId(user: UsersDocument): Promise<string> {
    await user.save();
    return user._id.toString();
  }

  async updateConfirmation(id: string): Promise<void> {
    const updatedUser = await UsersModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { "emailConfirmation.isConfirmed": true } },
    );
    if (updatedUser.matchedCount < 1) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return;
  }

  async updateConfirmationCode(
    id: string,
    confirmationCode: string,
    expiration: Date,
  ): Promise<void> {
    const updatedUser = await UsersModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "emailConfirmation.confirmationCode": confirmationCode,
          "emailConfirmation.expirationCode": expiration,
        },
      },
    );

    if (updatedUser.matchedCount < 1) {
      throw new RepositoryNotFoundError("User not found", "id");
    }

    return;
  }

  async delete(id: string): Promise<void> {
    const deletedUser = await UsersModel.deleteOne({_id: id});
    if (deletedUser.deletedCount < 1) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return;
  }

  async updatePassword(email: string, hash: string, salt: string): Promise<void> {
    const updatedUser = await UsersModel.updateOne({email: email}, {$set: {
      hash: hash,
      salt: salt,
    }})

    if (updatedUser.matchedCount < 1) {
      throw new BadRequestError("user not found", "email");
    };

    return;
  }
}

import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UserDbView } from "../type/user.db.interface";
import { BadRequestError } from "../../core/errors/bad-request.error";

export class UsersRepository {
  async create(userInput: UserDbView): Promise<string> {
    const createdUser = await usersCollection.insertOne(userInput);
    return createdUser.insertedId.toString();
  }

  async createByRegistration(userInput: UserDbView): Promise<string> {
    const createdUser = await usersCollection.insertOne(userInput);
    return createdUser.insertedId.toString();
  }

  async updateConfirmation(id: string): Promise<void> {
    const updatedUser = await usersCollection.updateOne(
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
    const updatedUser = await usersCollection.updateOne(
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
    const deletedUser = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedUser.deletedCount < 1) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return;
  }

  async updatePassword(email: string, hash: string, salt: string): Promise<void> {
    const updatedUser = await usersCollection.updateOne({email: email}, {$set: {
      hash: hash,
      salt: salt,
    }})

    if (updatedUser.matchedCount < 1) {
      throw new BadRequestError("user not found", "email");
    };

    return;
  }
}

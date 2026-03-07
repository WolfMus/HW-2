import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UserDto } from "../type/user-dto.interface";

export const usersRepository = {
  async create(userInput: UserDto): Promise<string> {
    const createdUser = await usersCollection.insertOne(userInput);
    return createdUser.insertedId.toString();
  },

  async delete(id: string): Promise<void> {
    const deletedUser = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedUser.deletedCount < 1) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return;
  },
};

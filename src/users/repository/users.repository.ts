import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { UserDto } from "../type/user-dto.interface";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";

export const usersRepository = {
  async create(userInput: UserDto): Promise<string> {
    const createdPost = await usersCollection.insertOne(userInput);
    return createdPost.insertedId.toString();
  },

  async delete(id: string): Promise<void> {
    const deletedPost = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedPost.deletedCount < 1) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return;
  },
};

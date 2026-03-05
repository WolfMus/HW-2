import { usersCollection } from "../../db/mongo.db";
import { UserDto } from "../type/user-dto.interface";

export const usersRepository = {

    async create(userInput: UserDto): Promise<string> {

        const createdPost = await usersCollection.insertOne(userInput);
        return createdPost.insertedId.toString();

    }


}
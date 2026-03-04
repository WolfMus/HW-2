import { WithId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { User } from "../type/user.type";
import { UsersQueryInput } from "../input/users-query.input";

export const usersQwRepository = {
  async findAll(
    queryInput: UsersQueryInput,
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryInput;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchLoginTerm) {
      filter.name = { $regex: searchLoginTerm, $options: "i" };
    };

    if (searchEmailTerm) {
      filter.name = { $regex: searchEmailTerm, $options: "i" };
    };

    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    return { items, totalCount };
  },
};

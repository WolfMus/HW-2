import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { User } from "../type/user.type";
import { UsersQueryInput } from "../input/users-query.input";
import { UserView } from "../type/user-view.interface";
import { Pagination } from "../../core/types/pagination.interface";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UnauthorizedError } from "../../core/errors/unauthorizedError.error";

export const usersQwRepository = {
  async findAll(queryInput: UsersQueryInput): Promise<Pagination<UserView[]>> {
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
    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];

      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
      }

      if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
      }
    }
    const sortOrder = sortDirection === "asc" ? 1 : -1;

    const items = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: items.map((u) => this._toViewModel(u)),
    };
  },

  async findById(id: string): Promise<UserView> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return this._toViewModel(user);
  },

  async findLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {

    const user = await usersCollection.findOne({
      $or: [{email: loginOrEmail}, {login: loginOrEmail}],
    })

    if (!user) {
      throw new UnauthorizedError("User not found", "login or email");
    };

    return user;
  },

  _toViewModel(item: WithId<User>): UserView {
    return {
      id: item._id.toString(),
      login: item.login,
      email: item.email,
      createdAt: item.createdAt,
    };
  },
};

import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongo.db";
import { User } from "../type/user.type";
import { UsersQueryInput } from "../input/users-query.input";
import { UserView } from "../type/user-view.interface";
import { Pagination } from "../../core/types/pagination.interface";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UnauthorizedError } from "../../core/errors/unauthorizedError.error";
import { UserDbView } from "../type/user.db.interface";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { UserDb } from "../type/user-db-view.interface";

export class UsersQwRepository {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }

  async findById(id: string): Promise<UserView> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return this._toViewModel(user);
  }

  async findByIdInDbView(id: string): Promise<UserDb> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new RepositoryNotFoundError("User not found", "id");
    }
    return this._toDbModel(user);
  }

  async findLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    return user;
  }

  async findLoginOrEmailOrFail(loginOrEmail: string): Promise<UserDb> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    if (!user) {
      throw new UnauthorizedError("User not found", "login or email");
    }

    return this._toDbModel(user);
  }

  async doesExistByLoginAndEmail(login: string, email: string): Promise<void> {
    const user = await usersCollection.findOne({
      $or: [{ email: email }, { login: login }],
    });

    if (user?.email === email) {
      throw new BadRequestError("User with same email exists", "email");
    }

    if (user?.login === login) {
      throw new BadRequestError("User with same login exists", "login");
    }

    return;
  }

  async doesExistByLoginOrEmail(loginOrEmail: string): Promise<UserDb> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    if (!user) {
      throw new BadRequestError("User not found", "email");
    }

    return this._toDbModel(user);
  }

  async findByConfirmationCode(code: string): Promise<UserDbView | null> {
    const user = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (!user) {
      throw new BadRequestError("User not found", "code");
    }
    return this._toDbModel(user);
  }

  _toViewModel(item: WithId<User>): UserView {
    return {
      id: item._id.toString(),
      login: item.login,
      email: item.email,
      createdAt: item.createdAt,
    };
  }

  _toDbModel(item: WithId<User>): UserDb {
    return {
      id: item._id.toString(),
      login: item.login,
      email: item.email,
      hash: item.hash,
      salt: item.salt,
      createdAt: item.createdAt,
      emailConfirmation: {
        confirmationCode: item.emailConfirmation.confirmationCode,
        expirationCode: item.emailConfirmation.expirationCode,
        isConfirmed: item.emailConfirmation.isConfirmed,
      },
    };
  }
}

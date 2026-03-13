import { bcryptService } from "../../core/heplers/bcrypt-service";
import { usersRepository } from "../repository/users.repository";
import { UserDto } from "../type/user-dto.interface";

export const userService = {
  async create(
    login: string,
    password: string,
    email: string,
  ): Promise<string> {

    const saltAndHash = await bcryptService.generateHash(password);

    const userInputBody: UserDto = {
      login: login,
      email: email,
      hash: saltAndHash.hash,
      salt: saltAndHash.salt,
      createdAt: new Date(),
    };

    console.log(userInputBody);

    const createdUserId = await usersRepository.create(userInputBody);

    return createdUserId;
  },

  async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
    return;
  },

};

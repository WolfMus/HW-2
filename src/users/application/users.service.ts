import { randomUUID } from "crypto";
import { bcryptService } from "../../core/heplers/bcrypt-service";
import { usersRepository } from "../repository/users.repository";
import { usersQwRepository } from "../repository/usersQw.repository";
import { UserDbView } from "../type/user.db.interface";
import { add } from "date-fns";
import { nodeMailerService } from "../../auth/application/nodeMailerService";

export const userService = {
  async create(
    login: string,
    password: string,
    email: string,
  ): Promise<string> {
    const saltAndHash = await bcryptService.generateHash(password);

    const userInputBody: UserDbView = {
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
        isConfirmed: true,
      }
    };

    const createdUserId = await usersRepository.create(userInputBody);

    return createdUserId;
  },

  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserDbView | null> {
    const userExist = await usersQwRepository.doesExistByLoginOrEmail(login, email);
    if (userExist) return null

    const {salt, hash} = await bcryptService.generateHash(password);

    const newUser: UserDbView = {
      login: login,
      email: email,
      hash: hash,
      salt: salt,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationCode: add(new Date(), {
          minutes: 5,
        }),
        isConfirmed: false,
      },
    };

    await usersRepository.createByRegistration(newUser);
    try {
      await nodeMailerService.sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode);

    } catch (e: unknown) {
      console.error(e);
    }
    
    return newUser
  },

  async delete(id: string): Promise<void> {
    await usersRepository.delete(id);
    return;
  },
};

import { BcryptService } from "../../core/heplers/bcrypt-service";
import { UsersRepository } from "../repository/users.repository";
import { UsersQwRepository } from "../repository/usersQw.repository";
import { NodeMailerService } from "../../auth/application/nodeMailerService";
import { inject, injectable } from "inversify";
import { UsersModel } from "../models/users.schema";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) protected usersRepo: UsersRepository,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
    @inject(BcryptService) protected cryptoService: BcryptService,
    @inject(NodeMailerService) protected emailService: NodeMailerService,
  ) {}

  // Создание пользователя админом
  async create(
    login: string,
    password: string,
    email: string,
  ): Promise<string> {

    // Создание Salt, Hash
    const saltAndHash: {salt: string, hash: string} = await this.cryptoService.generateHash(password);

    // Создание User'а и смена статуса почты на true
    const user = UsersModel.createUser(login, email, saltAndHash);
    user.updateEmailConfirmStatus(true);
    return this.usersRepo.saveAndReturnId(user);
  }

  // Регистрация пользователя
  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<void> {

    // Проверка существования User'а
    await this.usersQueryRepo.doesExistByLoginAndEmail(login, email);

    // Создание Salt, Hash
    const saltAndHash: { salt: string, hash: string } = await this.cryptoService.generateHash(password);

    // Создаем и сохраняем user'а
    const user = UsersModel.createUser(login, email, saltAndHash);
    await this.usersRepo.save(user);

    // Отправляем на почту confirmationCode
    try {
      await this.emailService.sendEmail(
        user.email,
        user.emailConfirmation.confirmationCode,
      );
    } catch (e: unknown) {
      console.error(e);
    }

    return;
  }

  async delete(id: string): Promise<void> {
    await this.usersRepo.delete(id);
    return;
  }

  async changePassword(email: string, hash: string, salt: string): Promise<void> {
    const user = await this.usersQueryRepo.findLoginOrEmail(email);
    user.updatePassword(hash, salt);
    return await this.usersRepo.save(user);
  }
}

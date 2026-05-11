import { BcryptService } from "../../core/heplers/bcrypt-service";
import { UsersRepository } from "../repository/users.repository";
import { UsersQwRepository } from "../repository/usersQw.repository";
import { NodeMailerService } from "../../auth/application/nodeMailerService";
import { inject, injectable } from "inversify";
import { UsersDocument, UsersModel } from "../models/users.schema";
import { UserView } from "../type/user-view.interface";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) protected usersRepo: UsersRepository,
    @inject(UsersQwRepository) protected usersQueryRepo: UsersQwRepository,
    @inject(BcryptService) protected cryptoService: BcryptService,
    @inject(NodeMailerService) protected emailService: NodeMailerService,
  ) {}

  // REGISTRATION
  async create(
    login: string,
    password: string,
    email: string,
  ): Promise<string> {

    // Создание Salt, Hash
    const saltAndHash: {salt: string, hash: string} = await this.cryptoService.generateHash(password);

    // Создание User'а и смена статуса почты на true
    const user = UsersModel.createUser(login, email, saltAndHash);
    user.updateConfirmationCodeStatus();
    const userId = await this.usersRepo.saveAndReturnId(user);
    return userId
  }

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
        user.emailConfirmation.confirmationCode!,
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

  async findById(id: string): Promise<UsersDocument> {
    return await this.usersRepo.findById(id);
  }

  async findInViewModel(id: string): Promise<UserView> {
    const user = await this.usersRepo.findById(id);
    return this._ToViewModel(user);
  }

  async changePassword(hash: string, salt: string, recoveryCode: string): Promise<void> {
    const user = await this.usersRepo.findByRecoveryCode(recoveryCode);
    user.updatePassword(hash, salt);
    return await this.usersRepo.save(user);
  }


  // CONFIRMATION CODE
  async checkConfirmationCode(code: string): Promise<void> {
    const user = await this.usersRepo.findByConfirmationCode(code);
    user.updateConfirmationCodeStatus();
    return await this.usersRepo.save(user);
  }

  async updateConfirmationCode(email: string): Promise<string> {
    const user = await this.usersQueryRepo.findLoginOrEmail(email);
    const confirmationCode = user.updateConfirmCode();
    return confirmationCode
  }
  

  // RECOVERY CODE
  async updateRecoveryCode(email: string): Promise<string> {
    const user = await this.usersQueryRepo.findLoginOrEmail(email);
    const recoveryCode = user.updateRecoveryCode();
    return recoveryCode;
  }

  _ToViewModel(user: UsersDocument): UserView {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    }
  }
}

import { randomUUID } from "crypto";
import { BcryptService } from "../../core/heplers/bcrypt-service";
import { UsersRepository } from "../repository/users.repository";
import { UsersQwRepository } from "../repository/usersQw.repository";
import { UserDbView } from "../type/user.db.interface";
import { add } from "date-fns";
import { NodeMailerService } from "../../auth/application/nodeMailerService";

export class UsersService {
  public usersRepo: UsersRepository;
  public usersQueryRepo: UsersQwRepository;
  public cryptoService: BcryptService;
  public emailService: NodeMailerService;

  constructor(
    usersRepo: UsersRepository,
    usersQueryRepo: UsersQwRepository,
    cryptoService: BcryptService,
    emailService: NodeMailerService,
  ) {
    this.usersRepo = usersRepo;
    this.usersQueryRepo = usersQueryRepo;
    this.cryptoService = cryptoService;
    this.emailService = emailService;
  }

  async create(
    login: string,
    password: string,
    email: string,
  ): Promise<string> {
    const saltAndHash = await this.cryptoService.generateHash(password);

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
      },
    };

    const createdUserId = await this.usersRepo.create(userInputBody);

    return createdUserId;
  }

  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserDbView | null> {
    await this.usersQueryRepo.doesExistByLoginAndEmail(login, email);

    const { salt, hash } = await this.cryptoService.generateHash(password);

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

    await this.usersRepo.createByRegistration(newUser);
    try {
      await this.emailService.sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
      );
    } catch (e: unknown) {
      console.error(e);
    }

    return newUser;
  }

  async delete(id: string): Promise<void> {
    await this.usersRepo.delete(id);
    return;
  }
}

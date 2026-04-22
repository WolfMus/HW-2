import { randomUUID } from "crypto";
import { UsersRepository } from "../../users/repository/users.repository";
import { UsersQwRepository } from "../../users/repository/usersQw.repository"
import { add } from "date-fns";
import { BadRequestError } from "../../core/errors/bad-request.error";

export class AuthService {
    private usersRepo: UsersRepository;
    private usersQueryRepo: UsersQwRepository;

    constructor(usersRepo: UsersRepository, usersQueryRepo: UsersQwRepository){
        this.usersRepo = usersRepo;
        this.usersQueryRepo = usersQueryRepo;
    }

    async checkConfirmationCode(code: string): Promise<void> {

        const userConfirmation = await this.usersQueryRepo.findByConfirmationCode(code);

        if (userConfirmation!.emailConfirmation.expirationCode < new Date()) {
            throw new BadRequestError("CONFIRMATION CODE EXPIRED", "code");
        };

        if (userConfirmation?.emailConfirmation.isConfirmed === true) {
            throw new BadRequestError("Confirmation code is already confirmed", "code");
        }

        const user = await this.usersQueryRepo.findLoginOrEmail(userConfirmation!.login);

        await this.usersRepo.updateConfirmation(user!._id.toString())
        return;
    }

    async updateConfirmationCodeForUser(id: string): Promise<string> {
        const confirmationCode = randomUUID();
        const expiration = add(new Date(), {
            minutes: 5,
        });
        await this.usersRepo.updateConfirmationCode(id, confirmationCode, expiration);
        return confirmationCode;
    }

    async isConfirmed(id: string): Promise<void> {
        const user = await this.usersQueryRepo.findByIdInDbView(id);
        if (user.emailConfirmation.isConfirmed === true) {
            throw new BadRequestError("User already confirmed", "email")
        }

        return
    }
}
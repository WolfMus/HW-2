import { randomUUID } from "crypto";
import { usersRepository } from "../../users/repository/users.repository";
import { usersQwRepository } from "../../users/repository/usersQw.repository"
import { add } from "date-fns";
import { BadRequestError } from "../../core/errors/bad-request.error";

export const authService = {
    async checkConfirmationCode(code: string): Promise<void> {

        const userConfirmation = await usersQwRepository.findByConfirmationCode(code);

        if (userConfirmation!.emailConfirmation.expirationCode < new Date()) {
            throw new BadRequestError("CONFIRMATION CODE EXPIRED", "code");
        };

        if (userConfirmation?.emailConfirmation.isConfirmed === true) {
            throw new BadRequestError("Confirmation code is already confirmed", "code");
        }

        const user = await usersQwRepository.findLoginOrEmail(userConfirmation!.login);

        await usersRepository.updateConfirmation(user!._id.toString())
        return;
    },

    async updateConfirmationCodeForUser(id: string): Promise<string> {
        const confirmationCode = randomUUID();
        const expiration = add(new Date(), {
            minutes: 5,
        });
        await usersRepository.updateConfirmationCode(id, confirmationCode, expiration);
        return confirmationCode;
    },

    async isConfirmed(id: string): Promise<void> {
        const user = await usersQwRepository.findByIdInDbView(id);
        if (user.emailConfirmation.isConfirmed === true) {
            throw new BadRequestError("User already confirmed", "email")
        }

        return
    }
}
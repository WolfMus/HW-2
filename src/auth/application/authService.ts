import { randomUUID } from "crypto";
import { usersRepository } from "../../users/repository/users.repository";
import { usersQwRepository } from "../../users/repository/usersQw.repository"
import { add } from "date-fns";

export const authService = {
    async checkConfirmationCode(code: string): Promise<void> {

        const userConfirmation = await usersQwRepository.findByConfirmationCode(code);
        if (userConfirmation!.emailConfirmation.expirationCode < new Date()) {
            throw new Error("CONFIRMATION CODE EXPIRED")
        };

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
}
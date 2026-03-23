import { usersRepository } from "../../users/repository/users.repository";
import { usersQwRepository } from "../../users/repository/usersQw.repository"

export const authService = {
    async checkConfirmationCode(code: string) {

        const userConfirmation = await usersQwRepository.findByConfirmationCode(code);
        if (userConfirmation?.emailConfirmation.confirmationCode !== code || userConfirmation.emailConfirmation.expirationCode < new Date()) {
            throw new Error("CONFIRMATION CODE EXPIRED")
        };

        const user = await usersQwRepository.findLoginOrEmail(userConfirmation.login);

        await usersRepository.updateConfirmation(user!._id.toString())
        return;
    },
}
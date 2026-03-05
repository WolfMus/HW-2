import { usersRepository } from "../repository/users.repository";
import { UserDto } from "../type/user-dto.interface";
import { UserInput } from "../type/user-input.interface";
import { User } from "../type/user.type";
import bcrypt from "bcrypt"

export const userService = {

    async create(login: string, password: string, email: string): Promise<string> {

        const passwordHash = await bcrypt.hash(password, 10);
        const userInputBody: UserDto = {
            login: login,
            password: passwordHash,
            email: email,
            createdAt: new Date(),
        }

        const createdUserId = await usersRepository.create(userInputBody);

        return createdUserId
    }

}
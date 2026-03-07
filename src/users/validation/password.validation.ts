import { body } from "express-validator"
import { usersQwRepository } from "../repository/usersQw.repository"

export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage("password is not correct")

export const emailValidation = body('email')
    .isString()
    .trim()
    .isLength({min: 1})
    .isEmail()
    .withMessage("email is not correct")
    .custom(
        async (email: string) => {
            const user = await usersQwRepository.findLoginOrEmail(email);

            if (user) {
                throw new Error('email is already exist');
            }

            return true;
        }
    )

export const loginValidation = body('login')
    .isString().bail()
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage('login is not correct')
    .custom(
        async (email: string) => {
            const user = await usersQwRepository.findLoginOrEmail(email);

            if (user) {
                throw new Error('login is already exist');
            }

            return true;
        }
    )

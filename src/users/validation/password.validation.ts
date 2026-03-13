import { body } from "express-validator"
import { usersQwRepository } from "../repository/usersQw.repository"

const LOGIN_REGEX = "^[a-zA-Z0-9_-]*$";
const EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$";


export const passwordValidation = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    
    export const emailValidation = body('email')
    .isString()
    .trim()
    .isEmail()
    .matches(EMAIL_REGEX)
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
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .matches(LOGIN_REGEX)
    .custom(
        async (email: string) => {
            const user = await usersQwRepository.findLoginOrEmail(email);
            
            if (user) {
                throw new Error('login is already exist');
            }

            return true;
        }
    )

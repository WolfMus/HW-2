import { body, query } from "express-validator";

export const confirmationCodeValidation = body('code')
    .isString()
    .withMessage('Confirmation code has wrong type')
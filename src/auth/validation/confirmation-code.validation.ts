import { query } from "express-validator";

export const confirmationCodeValidation = query('code')
    .isString()
    .withMessage('Query code has wrong type')
import { query } from "express-validator";

export const confirmationCodeValidation = query('code')
    .isString()
    .isUUID()
    .withMessage('Query code has wrong type')
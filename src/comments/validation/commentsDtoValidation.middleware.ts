import { body } from "express-validator";

export const commentsDtoValidation = body('content')
    .isString()
    .withMessage('Comment should be a string')
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('Comment`s length should be from 20 to 300')
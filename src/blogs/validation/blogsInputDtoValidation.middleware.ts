import { body } from "express-validator";

const URL_REGEX = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body('name')
    .isString().withMessage('name should be a string')
    .trim()
    .isLength({min: 1, max: 15}).withMessage('length of name is incorrect')

const descriptionValidation = body('description')
    .isString().withMessage('description should be a string')
    .trim()
    .isLength({min: 1, max: 500}).withMessage('description length is incorrect')

const urlValidation = body('websiteUrl')
    .isString().withMessage('website url should be a string')
    .trim()
    .isLength({min: 1, max: 100}).withMessage('website url length is incorrect')
    .matches(URL_REGEX)

export const blogsInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    urlValidation,
]
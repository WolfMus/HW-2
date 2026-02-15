import { body } from "express-validator";

  const titleValidation = body('title')
    .isString().withMessage('Title should be a string')
    .trim()
    .isLength({max: 30}).withMessage('Title length should be less than 30');

  const shortDescriptionValidation = body('shortDescription')
    .isString().withMessage('Short description should be a string')
    .trim()
    .isLength({max: 100}).withMessage('Should be less than 100');
  
  const contentValidation = body('content')
    .isString().withMessage('Should be a string')
    .trim()
    .isLength({max: 1000}).withMessage('Should be less than 1000');
  
  const blogIdValidation = body('blogId')
    .isString().withMessage('Should be a string')
    .isNumeric().withMessage('Should be a numeric string');

  export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
  ]
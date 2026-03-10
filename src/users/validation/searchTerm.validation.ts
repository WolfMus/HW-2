import { query } from "express-validator";

const loginValidation = query("searchLoginTerm")
  .optional()
  .isString()
  .trim()
  // .isLength({ min: 3, max: 10 })
  .withMessage("login is not correct");

const emailValidation = query("searchEmailTerm")
  .optional()
  .isString()
  .trim()
  // .isLength({ min: 1 })
  // .isEmail()
  .withMessage("email is not correct");


  export const loginAndEmailValidation = [loginValidation, emailValidation]
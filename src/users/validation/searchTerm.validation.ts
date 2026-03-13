import { query } from "express-validator";

const loginValidation = query("searchLoginTerm")
  .optional()
  .isString()
  .trim()
  .withMessage("login is not correct");

const emailValidation = query("searchEmailTerm")
  .optional()
  .isString()
  .trim()
  .withMessage("email is not correct");


  export const loginAndEmailValidation = [loginValidation, emailValidation]
import { param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must not be empty")
  // .isMongoId()
  // .withMessage("Incorrect format of ObjectId"); // Проверка на формат ObjectId'
  

import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  validationResult,
  ValidationError,
} from "express-validator";
import { HttpStatus } from "../../types/types";
import { FieldErrorMessage } from "../../types/validationError";
import { validationErrorDto } from "../../types/validationErrorDto";

export const createErrorMessage = (
  errors: FieldErrorMessage[],
): validationErrorDto => {
  return { errorMessage: errors };
};

const formatErrors = (error: ValidationError): FieldErrorMessage => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  // const firstError = errors[0];
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorsMessages: errors });
    return;
  }

  next();
};

import { Response } from "express";
import { RepositoryNotFoundError } from "./repository-not-found.error";
import { HttpStatus } from "../types/types";
import { createErrorMessage } from "../middlewares/validation/input-validation-result.middleware";
import { UnauthorizedError } from "./unauthorizedError.error";

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessage([
        {
          field: error.field,
          message: error.message,
        },
      ]),
    );
    return;
  }

  if (error instanceof UnauthorizedError) {
    const httpstatus = HttpStatus.Unauthorized;

    res.sendStatus(httpstatus);
    return;
  }
}

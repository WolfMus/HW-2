import { FieldErrorMessage } from "./validationError";

export const createErrorMessage = (errors: FieldErrorMessage[]): { errorMessage: FieldErrorMessage[] } => {
  return { errorMessage: errors };
};
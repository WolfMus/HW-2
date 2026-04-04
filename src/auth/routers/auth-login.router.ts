import { Router } from "express";
import { authLoginHandler } from "./handler/postAuthLogin.handler";
import {
  emailForResendingValidation,
  emailValidation,
  loginOrEmailValidation,
  loginValidation,
  passwordValidation,
} from "../../users/validation/password.validation";
import { tokenGuard } from "../middleware/tokenGuard.guard";
import { getInformationAboutUserHandler } from "./handler/getInformation.handler";
import { registrationHandler } from "./handler/registration.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { confirmationCodeValidation } from "../validation/confirmation-code.validation";
import { confirmationHandler } from "./handler/confirmation.handler";
import { emailResendingHandler } from "./handler/emailResending.handler";
import { updateRefreshTokenHandler } from "./handler/updateRefreshToken.handler";
import { refreshTokenLogoutHandler } from "./handler/refreshTokenLogout.handler";

export const authRouter = Router({});

authRouter

  .post("/login", passwordValidation, loginOrEmailValidation, inputValidationResultMiddleware, authLoginHandler)

  .get("/me", tokenGuard, getInformationAboutUserHandler)

  .post("/refresh-token", tokenGuard, updateRefreshTokenHandler)

  .post("/logout", tokenGuard, refreshTokenLogoutHandler)

  .post(
    "/registration",
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    registrationHandler,
  )

  .post(
    "/registration-confirmation",
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    confirmationHandler,
  )

  .post(
    "/registration-email-resending",
    emailForResendingValidation,
    inputValidationResultMiddleware,
    emailResendingHandler,
  );

  

import { Router } from "express";
import { authLoginHandler } from "./handler/postAuthLogin.handler";
import {
  emailForResendingValidation,
  emailValidation,
  loginOrEmailValidation,
  loginValidation,
  passwordValidation,
} from "../../users/validation/password.validation";
import { getInformationAboutUserHandler } from "./handler/getInformation.handler";
import { registrationHandler } from "./handler/registration.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { confirmationCodeValidation } from "../validation/confirmation-code.validation";
import { confirmationHandler } from "./handler/confirmation.handler";
import { emailResendingHandler } from "./handler/emailResending.handler";
import { updateRefreshTokenHandler } from "./handler/updateRefreshToken.handler";
import { refreshTokenLogoutHandler } from "./handler/refreshTokenLogout.handler";
import { refreshTokenGuard } from "../middleware/refresh-token.guard";
import { tokenGuard } from "../middleware/tokenGuard.guard";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { passwordRecoveryHandler } from "./handler/password-recovery.handler";

export const authRouter = Router({});

authRouter

  .post("/login", rateLimitMiddleware, passwordValidation, loginOrEmailValidation, inputValidationResultMiddleware, authLoginHandler)

  .get("/me", tokenGuard, getInformationAboutUserHandler)

  .post("/refresh-token", refreshTokenGuard, updateRefreshTokenHandler)

  .post("/logout", refreshTokenGuard, refreshTokenLogoutHandler)

  .post(
    "/registration",
    rateLimitMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    registrationHandler,
  )

  .post(
    "/registration-confirmation",
    rateLimitMiddleware,
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    confirmationHandler,
  )

  .post(
    "/registration-email-resending",
    rateLimitMiddleware,
    emailForResendingValidation,
    inputValidationResultMiddleware,
    emailResendingHandler,
  )

  .post(
    "/password-recovery",
    rateLimitMiddleware,
    emailForResendingValidation,
    inputValidationResultMiddleware,
    passwordRecoveryHandler,
  )

  .post(
    "/new-password",
    rateLimitMiddleware,
    passwordValidation,
    inputValidationResultMiddleware,
    newPasswordHandler
  )

  

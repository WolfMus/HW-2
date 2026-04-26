import { Router } from "express";
import {
  emailForResendingValidation,
  emailValidation,
  loginOrEmailValidation,
  loginValidation,
  passwordValidation,
} from "../../users/validation/password.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { confirmationCodeValidation } from "../validation/confirmation-code.validation";
import { refreshTokenGuard } from "../middleware/refresh-token.guard";
import { tokenGuard } from "../middleware/tokenGuard.guard";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { authController } from "../../composition-root";
import { passwordRecoveryHandler } from "./handler/password-recovery.handler";
import { newPasswordHandler } from "./handler/new-password.handler";

export const authRouter = Router({});

authRouter

  .post(
    "/login",
    rateLimitMiddleware,
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    authController.authLogin.bind(authController),
  )

  .get("/me", tokenGuard, authController.getInformationAboutUser.bind(authController))

  .post("/refresh-token", refreshTokenGuard, authController.updateRefreshToken.bind(authController))

  .post("/logout", refreshTokenGuard, authController.refreshTokenLogout.bind(authController))

  .post(
    "/registration",
    rateLimitMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    authController.registration.bind(authController),
  )

  .post(
    "/registration-confirmation",
    rateLimitMiddleware,
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    authController.confirmation.bind(authController),
  )

  .post(
    "/registration-email-resending",
    rateLimitMiddleware,
    emailForResendingValidation,
    inputValidationResultMiddleware,
    authController.emailResending.bind(authController),
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

  

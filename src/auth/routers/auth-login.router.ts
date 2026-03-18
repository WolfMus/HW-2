import { Router } from "express";
import { authLoginHandler } from "./handler/postAuthLogin.handler";
import {
  loginOrEmailValidation,
  passwordValidation,
} from "../../users/validation/password.validation";
import { tokenGuard } from "../middleware/tokenGuard";

export const authRouter = Router({});

authRouter

.post(
  "/login",
  passwordValidation,
  loginOrEmailValidation,
  authLoginHandler,
)

.get("/me", tokenGuard, )

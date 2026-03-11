import { Router } from "express";
import { authLoginHandler } from "./handler/postAuthLogin.handler";

export const authRouter = Router({});

authRouter
    .post("", authLoginHandler);
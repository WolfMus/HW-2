import { Request } from "express";
import { IdType } from "./id";

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,

  TooManyRequests = 429,

  InternalServerError = 500,
}

export type RequestWithParams<T> = Request<T, {}, {}, {}>;
export type RequestWithParamsAndUserId<T, U extends IdType> = Request<
  T,
  {},
  {},
  {},
  U
>;
export type RequestWithBody<T> = Request<{}, {}, T, {}>;
export type RequestWithBodyAndUserId<T, U extends IdType> = Request<{}, {}, T, {}, U>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B, {}>;
export type RequestWithParamsAndBodyAndUserId<T, B, U extends IdType> = Request<
  T,
  {},
  B,
  {},
  U
>;
export type RequestWithParamsAndQuery<T, B> = Request<T, {}, {}, B>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;

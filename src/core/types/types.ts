import { Request } from "express";

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,

  InternalServerError = 500,
}

export type RequestWithParams<T> = Request<T, {}, {}, {}>;
export type RequestWithBody<T> = Request<{}, {}, T, {}>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B, {}>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;

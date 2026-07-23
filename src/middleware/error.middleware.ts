import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/errors/AppError";
import { logger } from "../shared/logger/logger";
import { env } from "../config/env";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: err.message || "Internal Server Error",
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

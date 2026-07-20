import { Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    data: unknown,
    message = "Success",
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

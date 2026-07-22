import { Request, Response } from "express";

import { getChatService } from "../../container/services";
import { ApiResponse } from "../../shared/responses/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { chatRequestSchema } from "../validators/chat.validator";

export const ask = asyncHandler(async (req: Request, res: Response) => {
  const parsed = chatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return ApiResponse.error(res, parsed.error.issues[0]?.message ?? "Invalid request", 400);
  }

  const chatService = await getChatService();
  const response = await chatService.answer(parsed.data.question);

  return ApiResponse.success(res, response, "Answer generated", 200);
});

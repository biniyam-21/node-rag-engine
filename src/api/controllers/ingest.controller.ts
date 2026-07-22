import { Request, Response } from "express";

import { getIngestionService } from "../../container/services";
import { ApiResponse } from "../../shared/responses/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ingestRequestSchema } from "../validators/chat.validator";

export const ingestKnowledge = asyncHandler(async (req: Request, res: Response) => {
  const parsed = ingestRequestSchema.safeParse(req.body ?? {});

  if (!parsed.success) {
    return ApiResponse.error(res, parsed.error.issues[0]?.message ?? "Invalid request", 400);
  }

  const ingestionService = await getIngestionService();
  const result = await ingestionService.ingest(parsed.data.force ?? false);

  return ApiResponse.success(res, result, "Knowledge ingestion completed", 200);
});

import { Request, Response } from "express";

import { env } from "../../config/env";
import { ragConfig } from "../../config/rag";
import { ApiResponse } from "../../shared/responses/apiResponse";

export const health = (_req: Request, res: Response) => {
  ApiResponse.success(
    res,
    {
      version: "1.0.0",
      environment: env.NODE_ENV,
      rag: {
        vectorStore: ragConfig.vectorStore,
        chunkStrategy: ragConfig.chunkStrategy,
        ready: true,
      },
    },
    "Backend is healthy",
  );
};

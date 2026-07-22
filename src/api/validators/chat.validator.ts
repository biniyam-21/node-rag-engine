import { z } from "zod";

export const chatRequestSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(2000),
});

export const ingestRequestSchema = z.object({
  force: z.boolean().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type IngestRequest = z.infer<typeof ingestRequestSchema>;

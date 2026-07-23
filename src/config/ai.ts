import dotenv from "dotenv";

dotenv.config();

export const aiConfig = {
  provider: (process.env.AI_PROVIDER || "openrouter").toLowerCase(),
  baseUrl: process.env.AI_BASE_URL || "http://localhost:11434",
  chatModel: process.env.CHAT_MODEL || "anthropic/claude-3.5-sonnet",
  embeddingModel: process.env.EMBEDDING_MODEL || "openai/text-embedding-3-small",
  temperature: Number(process.env.AI_TEMPERATURE ?? 0.2),
  maxTokens: Number(process.env.AI_MAX_TOKENS ?? 2048),
  thinkEnabled: process.env.OLLAMA_THINK === "true",
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseUrl: "https://openrouter.ai/api/v1",
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
  },
};
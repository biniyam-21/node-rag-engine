export const aiConfig = {
  baseUrl: process.env.AI_BASE_URL ?? "http://localhost:11434",
  chatModel: process.env.CHAT_MODEL ?? "deepseek-coder:6.7b",
  embeddingModel: process.env.EMBEDDING_MODEL ?? "nomic-embed-text",
  temperature: 0.2,
  maxTokens: Number(process.env.AI_MAX_TOKENS ?? 2048),
  thinkEnabled: process.env.OLLAMA_THINK === "true",
};

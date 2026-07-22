import path from "path";

export const paths = {
  root: process.cwd(),

  knowledge: path.join(process.cwd(), "knowledge"),

  vectorDatabase: path.join(process.cwd(), "database"),

  logs: path.join(process.cwd(), "logs"),
};

export const ragConfig = {
  chunkSize: 800,

  chunkOverlap: 150,

  maxRetrievedChunks: 5,

  similarityThreshold: Number(process.env.SIMILARITY_THRESHOLD ?? 0.5),

  chunkStrategy: process.env.CHUNK_STRATEGY ?? "markdown",

  vectorStore: process.env.VECTOR_STORE ?? "lancedb",

  maxPromptTokens: 3000,
};
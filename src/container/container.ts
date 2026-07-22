import { OllamaEmbeddingProvider } from "../ai/implementations/ollama/OllamaEmbeddingProvider";
import { ragConfig } from "../config/rag";
import { paths } from "../config/paths";
import { createChunkStrategy } from "../rag/chunking";
import { OllamaRagChatProvider } from "../rag/chat/ChatProvider";
import { ChatService } from "../rag/chat/ChatService";
import { IngestionService } from "../rag/ingestion/IngestionService";
import { MarkdownLoader } from "../rag/loaders/MarkdownLoader";
import { PromptBuilder } from "../rag/prompts/PromptBuilder";
import { Retriever } from "../rag/retrieval/Retriever";
import { createVectorStore } from "../rag/vector/createVectorStore";
import { VectorStore } from "../rag/vector/types";
import { ContainerTypes } from "./types";

export interface AppContainer {
  [ContainerTypes.MarkdownLoader]: MarkdownLoader;
  [ContainerTypes.ChunkStrategy]: ReturnType<typeof createChunkStrategy>;
  [ContainerTypes.EmbeddingProvider]: OllamaEmbeddingProvider;
  [ContainerTypes.VectorStore]: VectorStore;
  [ContainerTypes.Retriever]: Retriever;
  [ContainerTypes.PromptBuilder]: PromptBuilder;
  [ContainerTypes.ChatProvider]: OllamaRagChatProvider;
  [ContainerTypes.ChatService]: ChatService;
  [ContainerTypes.IngestionService]: IngestionService;
}

export async function createContainer(): Promise<AppContainer> {
  const loader = new MarkdownLoader(paths.knowledge);
  const chunkStrategy = createChunkStrategy(ragConfig.chunkStrategy);
  const embeddingProvider = new OllamaEmbeddingProvider();
  const vectorStore = await createVectorStore();
  const retriever = new Retriever(vectorStore, embeddingProvider);
  const promptBuilder = new PromptBuilder();
  const chatProvider = new OllamaRagChatProvider();
  const chatService = new ChatService(retriever, promptBuilder, chatProvider);
  const ingestionService = new IngestionService(
    loader,
    chunkStrategy,
    vectorStore,
    embeddingProvider,
  );

  return {
    [ContainerTypes.MarkdownLoader]: loader,
    [ContainerTypes.ChunkStrategy]: chunkStrategy,
    [ContainerTypes.EmbeddingProvider]: embeddingProvider,
    [ContainerTypes.VectorStore]: vectorStore,
    [ContainerTypes.Retriever]: retriever,
    [ContainerTypes.PromptBuilder]: promptBuilder,
    [ContainerTypes.ChatProvider]: chatProvider,
    [ContainerTypes.ChatService]: chatService,
    [ContainerTypes.IngestionService]: ingestionService,
  };
}

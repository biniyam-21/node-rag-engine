export const ContainerTypes = {
  MarkdownLoader: Symbol("MarkdownLoader"),
  ChunkStrategy: Symbol("ChunkStrategy"),
  EmbeddingProvider: Symbol("EmbeddingProvider"),
  VectorStore: Symbol("VectorStore"),
  Retriever: Symbol("Retriever"),
  PromptBuilder: Symbol("PromptBuilder"),
  ChatProvider: Symbol("ChatProvider"),
  ChatService: Symbol("ChatService"),
  IngestionService: Symbol("IngestionService"),
} as const;

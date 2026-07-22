import { ragConfig } from "../../config/rag";
import { EmbeddingProvider } from "../embeddings/EmbeddingProvider";
import { ScoredChunk, VectorStore } from "../vector/types";

export class Retriever {
  constructor(
    private readonly vectorStore: VectorStore,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly limit = ragConfig.maxRetrievedChunks,
    private readonly minScore = ragConfig.similarityThreshold,
  ) {}

  async retrieve(query: string): Promise<ScoredChunk[]> {
    const normalized = query.trim();

    if (!normalized) {
      return [];
    }

    const embedding = await this.embeddingProvider.embed(normalized);

    return this.vectorStore.search(embedding.vector, {
      limit: this.limit,
      minScore: this.minScore,
    });
  }
}

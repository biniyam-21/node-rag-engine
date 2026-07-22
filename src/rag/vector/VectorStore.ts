import { Chunk } from "../chunking/Chunk";
import { ScoredChunk, SearchOptions, VectorStore } from "./types";
import { rankSearchResults } from "./rankSearchResults";

interface VectorRecord {
  chunk: Chunk;
  embedding: number[];
}

export class InMemoryVectorStore implements VectorStore {
  private readonly records: VectorRecord[] = [];

  async addChunk(chunk: Chunk, embedding: number[]): Promise<void> {
    this.records.push({ chunk, embedding });
  }

  async search(queryEmbedding: number[], options: SearchOptions = {}): Promise<ScoredChunk[]> {
    const limit = options.limit ?? 5;
    const minScore = options.minScore ?? 0;

    const scored = this.records.map((record) => ({
      chunk: record.chunk,
      score: this.cosineSimilarity(queryEmbedding, record.embedding),
    }));

    return rankSearchResults(scored, limit, minScore);
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    for (let index = this.records.length - 1; index >= 0; index -= 1) {
      if (this.records[index].chunk.metadata.documentId === documentId) {
        this.records.splice(index, 1);
      }
    }
  }

  async clear(): Promise<void> {
    this.records.length = 0;
  }

  private cosineSimilarity(left: number[], right: number[]): number {
    if (!left.length || !right.length) {
      return 0;
    }

    const length = Math.min(left.length, right.length);
    let dotProduct = 0;
    let leftMagnitude = 0;
    let rightMagnitude = 0;

    for (let index = 0; index < length; index += 1) {
      dotProduct += left[index] * right[index];
      leftMagnitude += left[index] ** 2;
      rightMagnitude += right[index] ** 2;
    }

    if (leftMagnitude === 0 || rightMagnitude === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
  }
}

export { VectorStore, ScoredChunk, SearchOptions } from "./types";

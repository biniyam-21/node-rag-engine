import { Chunk } from "../chunking/Chunk";

export interface ScoredChunk {
  chunk: Chunk;
  score: number;
}

export interface SearchOptions {
  limit?: number;
  minScore?: number;
}

export interface VectorStore {
  addChunk(chunk: Chunk, embedding: number[]): Promise<void>;
  search(queryEmbedding: number[], options?: SearchOptions): Promise<ScoredChunk[]>;
  deleteByDocumentId(documentId: string): Promise<void>;
  clear(): Promise<void>;
}

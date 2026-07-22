import * as lancedb from "@lancedb/lancedb";

import { Chunk } from "../chunking/Chunk";
import { ScoredChunk, SearchOptions, VectorStore } from "./types";
import { rankSearchResults } from "./rankSearchResults";

const TABLE_NAME = "portfolio_chunks";

interface ChunkRecord extends Record<string, unknown> {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  totalChunks: number;
  title: string;
  category: string;
  source: string;
  relativePath: string;
  tags: string;
  content: string;
  vector: number[];
}

export class LanceDBVectorStore implements VectorStore {
  private table: lancedb.Table | null = null;

  private constructor(private readonly db: lancedb.Connection) {}

  static async create(dbPath: string): Promise<LanceDBVectorStore> {
    const db = await lancedb.connect(dbPath);
    return new LanceDBVectorStore(db);
  }

  async addChunk(chunk: Chunk, embedding: number[]): Promise<void> {
    const table = await this.ensureTable(chunk, embedding);
    await table.add([this.toRecord(chunk, embedding)]);
  }

  async search(queryEmbedding: number[], options: SearchOptions = {}): Promise<ScoredChunk[]> {
    if (!this.table || queryEmbedding.length === 0) {
      return [];
    }

    const limit = options.limit ?? 5;
    const minScore = options.minScore ?? 0;
    const fetchLimit = Math.max(limit * 3, 10);
    const results = (await this.table
      .vectorSearch(queryEmbedding)
      .distanceType("cosine")
      .limit(fetchLimit)
      .toArray()) as Array<ChunkRecord & { _distance?: number }>;

    const scored = results.map((record) => ({
      chunk: this.fromRecord(record),
      score: this.distanceToScore(record._distance ?? 1),
    }));

    return rankSearchResults(scored, limit, minScore);
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    if (!this.table) {
      return;
    }

    await this.table.delete(`documentId = '${this.escapeLiteral(documentId)}'`);
  }

  async clear(): Promise<void> {
    if (!this.table) {
      return;
    }

    await this.table.delete("chunkId != ''");
  }

  private async ensureTable(chunk: Chunk, embedding: number[]): Promise<lancedb.Table> {
    if (this.table) {
      return this.table;
    }

    const tableNames = await this.db.tableNames();

    if (tableNames.includes(TABLE_NAME)) {
      this.table = await this.db.openTable(TABLE_NAME);
      return this.table;
    }

    this.table = await this.db.createTable(TABLE_NAME, [this.toRecord(chunk, embedding)]);
    return this.table;
  }

  private toRecord(chunk: Chunk, embedding: number[]): ChunkRecord {
    return {
      chunkId: chunk.metadata.chunkId,
      documentId: chunk.metadata.documentId,
      chunkIndex: chunk.metadata.chunkIndex,
      totalChunks: chunk.metadata.totalChunks,
      title: chunk.metadata.title,
      category: chunk.metadata.category,
      source: chunk.metadata.source,
      relativePath: chunk.metadata.relativePath,
      tags: JSON.stringify(chunk.metadata.tags),
      content: chunk.content,
      vector: embedding,
    };
  }

  private fromRecord(record: ChunkRecord): Chunk {
    return {
      content: record.content,
      metadata: {
        chunkId: record.chunkId,
        documentId: record.documentId,
        chunkIndex: record.chunkIndex,
        totalChunks: record.totalChunks,
        title: record.title,
        category: record.category,
        source: record.source,
        relativePath: record.relativePath,
        tags: this.parseTags(record.tags),
      },
    };
  }

  private parseTags(value: string): string[] {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.filter((tag) => typeof tag === "string") : [];
    } catch {
      return [];
    }
  }

  private distanceToScore(distance: number): number {
    return Math.max(0, 1 - distance);
  }

  private escapeLiteral(value: string): string {
    return value.replace(/'/g, "''");
  }
}

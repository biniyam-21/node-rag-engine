import path from "node:path";

import { paths } from "../../config/paths";
import { logger } from "../../shared/logger/logger";
import { ChunkStrategy } from "../chunking/ChunkStrategy";
import { Chunk } from "../chunking/Chunk";
import { EmbeddingProvider } from "../embeddings/EmbeddingProvider";
import { MarkdownLoader } from "../loaders/MarkdownLoader";
import { Document } from "../types/Document";
import { VectorStore } from "../vector/types";
import { DocumentManifestEntry, Manifest } from "./Manifest";
import { ManifestStore } from "./ManifestStore";

export interface IngestionResult {
  ingestedDocuments: number;
  skippedDocuments: number;
  totalChunks: number;
}

export class IngestionService {
  constructor(
    private readonly loader: MarkdownLoader,
    private readonly chunkStrategy: ChunkStrategy,
    private readonly vectorStore: VectorStore,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly manifestStore = new ManifestStore(
      path.join(paths.vectorDatabase, "manifest.json"),
    ),
  ) {}

  async ingest(force = false): Promise<IngestionResult> {
    const documents = await this.loader.loadAll();
    const previousManifest = force ? null : await this.manifestStore.read();
    const previousEntries = new Map(
      (previousManifest?.documents ?? []).map((entry) => [entry.relativePath, entry]),
    );
    const currentPaths = new Set<string>();

    let ingestedDocuments = 0;
    let skippedDocuments = 0;
    let totalChunks = 0;
    const manifestEntries: DocumentManifestEntry[] = [];

    for (const document of documents) {
      currentPaths.add(document.metadata.relativePath);
      const previousEntry = previousEntries.get(document.metadata.relativePath);
      const isUnchanged = previousEntry?.hash === document.hash;

      if (!force && isUnchanged) {
        skippedDocuments += 1;
        manifestEntries.push(previousEntry);
        continue;
      }

      await this.vectorStore.deleteByDocumentId(document.metadata.id);
      const chunks = await this.ingestDocument(document);
      totalChunks += chunks.length;
      ingestedDocuments += 1;

      manifestEntries.push({
        relativePath: document.metadata.relativePath,
        hash: document.hash,
        documentId: document.metadata.id,
      });
    }

    for (const entry of previousEntries.values()) {
      if (!currentPaths.has(entry.relativePath)) {
        await this.vectorStore.deleteByDocumentId(entry.documentId);
      }
    }

    await this.manifestStore.write({
      documents: manifestEntries,
      ingestedAt: new Date().toISOString(),
    });

    logger.info(
      {
        ingestedDocuments,
        skippedDocuments,
        totalChunks,
      },
      "Knowledge ingestion completed",
    );

    return {
      ingestedDocuments,
      skippedDocuments,
      totalChunks,
    };
  }

  private async ingestDocument(document: Document): Promise<Chunk[]> {
    const chunks = await this.chunkStrategy.chunk(document);

    for (const chunk of chunks) {
      const embedding = await this.embeddingProvider.embed(chunk.content);
      await this.vectorStore.addChunk(chunk, embedding.vector);
    }

    return chunks;
  }
}

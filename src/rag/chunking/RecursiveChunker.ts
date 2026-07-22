import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { ragConfig } from "../../config/rag";
import { Document } from "../types/Document";
import { Chunk } from "./Chunk";
import { ChunkStrategy } from "./ChunkStrategy";
import { DEFAULT_SEPARATORS } from "./Separator";

export class RecursiveChunker implements ChunkStrategy {
  constructor(
    private readonly chunkSize = ragConfig.chunkSize,
    private readonly chunkOverlap = ragConfig.chunkOverlap,
  ) {}

  async chunk(document: Document): Promise<Chunk[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
      separators: [...DEFAULT_SEPARATORS],
    });

    const pieces = await splitter.splitText(document.content);

    return pieces.map((piece, index) => ({
      content: piece,
      metadata: {
        chunkId: `${document.metadata.id}-${index}`,
        documentId: document.metadata.id,
        chunkIndex: index,
        totalChunks: pieces.length,
        title: document.metadata.title,
        category: document.metadata.category,
        source: document.metadata.source,
        relativePath: document.metadata.relativePath,
        tags: document.metadata.tags,
      },
    }));
  }
}

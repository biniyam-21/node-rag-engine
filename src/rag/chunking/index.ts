import { ragConfig } from "../../config/rag";
import { Document } from "../types/Document";
import { Chunk } from "./Chunk";
import { ChunkStrategy } from "./ChunkStrategy";
import { MarkdownChunker } from "./MarkdownChunker";
import { RecursiveChunker } from "./RecursiveChunker";
import { TextSplitter } from "./TextSplitter";

export class TextSplitterChunker implements ChunkStrategy {
  constructor(private readonly splitter = new TextSplitter()) {}

  async chunk(document: Document): Promise<Chunk[]> {
    const pieces = this.splitter.split(document.content);

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

export function createChunkStrategy(
  strategy: string = ragConfig.chunkStrategy,
): ChunkStrategy {
  switch (strategy) {
    case "recursive":
      return new RecursiveChunker();
    case "text":
      return new TextSplitterChunker();
    case "markdown":
    default:
      return new MarkdownChunker();
  }
}

export { ChunkStrategy } from "./ChunkStrategy";
export { Chunk } from "./Chunk";
export { MarkdownChunker } from "./MarkdownChunker";
export { RecursiveChunker } from "./RecursiveChunker";
export { TextSplitter } from "./TextSplitter";

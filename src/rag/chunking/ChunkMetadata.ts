export interface ChunkMetadata {
  chunkId: string;

  documentId: string;

  chunkIndex: number;

  totalChunks: number;

  title: string;

  category: string;

  source: string;

  relativePath: string;

  tags: string[];
}

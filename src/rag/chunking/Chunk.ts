import { ChunkMetadata } from "./ChunkMetadata";

export interface Chunk {
  content: string;

  metadata: ChunkMetadata;
}

import { Document } from "../types/Document";
import { Chunk } from "./Chunk";

export interface ChunkStrategy {
  chunk(document: Document): Promise<Chunk[]>;
}

import { EmbeddingResult } from "../types/EmbeddingResult";

export interface EmbeddingProvider {
  embed(text: string): Promise<EmbeddingResult>;
}

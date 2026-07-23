import { EmbeddingProvider } from "./EmbeddingProvider";
import { EmbeddingResult } from "../types/EmbeddingResult";

export class GroqEmbeddingProvider implements EmbeddingProvider {
  async embed(_text: string): Promise<EmbeddingResult> {
    console.warn("Groq doesn't support embeddings directly.");
    return { vector: Array.from({ length: 32 }, () => 0) };
  }
}

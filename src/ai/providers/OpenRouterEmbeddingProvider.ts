import { EmbeddingProvider } from "./EmbeddingProvider";
import { OpenRouterClient } from "../clients/OpenRouterClient";
import { EmbeddingResult } from "../types/EmbeddingResult";
import { aiConfig } from "../../config/ai";

export class OpenRouterEmbeddingProvider implements EmbeddingProvider {
  private client: OpenRouterClient;

  constructor() {
    this.client = new OpenRouterClient();
  }

  async embed(text: string): Promise<EmbeddingResult> {
    const normalized = text.trim();
    if (!normalized) {
      return { vector: [] };
    }

    const response = await this.client.getClient().embeddings.create({
      model: aiConfig.embeddingModel,
      input: normalized,
    });

    const vector = response.data[0]?.embedding ?? [];
    return { vector };
  }
}

import { aiConfig } from "../../../config/ai";
import { OllamaClient } from "../../clients/OllamaClient";
import { ChatProvider } from "../../providers/ChatProvider";
import { EmbeddingProvider } from "../../providers/EmbeddingProvider";
import { EmbeddingResult } from "../../types/EmbeddingResult";

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  constructor(private readonly client = new OllamaClient()) {}

  async embed(text: string): Promise<EmbeddingResult> {
    const normalized = text.trim();

    if (!normalized) {
      return { vector: [] };
    }

    try {
      return await this.client.embed(normalized, aiConfig.embeddingModel);
    } catch {
      return { vector: this.createFallbackVector(normalized) };
    }
  }

  private createFallbackVector(text: string): number[] {
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);

    if (words.length === 0) {
      return Array.from({ length: 32 }, () => 0);
    }

    return Array.from({ length: 32 }, (_, index) => {
      const token = words[index % words.length] ?? words[0];
      return this.hashValue(`${token}:${index}`) / 1000;
    });
  }

  private hashValue(value: string): number {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(index);
      hash |= 0;
    }

    return Math.abs(hash);
  }
}

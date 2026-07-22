import { ragConfig } from "../../config/rag";
import { ScoredChunk } from "../vector/types";

export class PromptBuilder {
  buildPrompt(question: string, chunks: ScoredChunk[]): string {
    const context = chunks.length
      ? chunks
          .map((entry, index) => {
            const label = entry.chunk.metadata.relativePath || entry.chunk.metadata.title;
            return `[${index + 1}] Source: ${label}\n${entry.chunk.content}`;
          })
          .join("\n\n")
      : "No relevant context was found in the knowledge base.";

    const trimmedContext = this.trimToTokenBudget(context, ragConfig.maxPromptTokens);

    return [
      "You are a portfolio assistant for Biniyam Tesfu.",
      "Answer using only the supplied context.",
      "If the context does not contain the answer, say you do not have enough information.",
      "Do not invent projects, employers, dates, or skills.",
      `Question: ${question}`,
      "Context:",
      trimmedContext,
      "Respond clearly and professionally.",
    ].join("\n\n");
  }

  private trimToTokenBudget(text: string, maxTokens: number): string {
    const approximateTokenCount = Math.ceil(text.length / 4);

    if (approximateTokenCount <= maxTokens) {
      return text;
    }

    const maxCharacters = maxTokens * 4;
    return `${text.slice(0, maxCharacters).trim()}...`;
  }
}

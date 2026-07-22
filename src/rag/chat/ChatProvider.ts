import { aiConfig } from "../../config/ai";
import { logger } from "../../shared/logger/logger";
import { OllamaChatProvider } from "../../ai/implementations/ollama/OllamaChatProvider";
import { ScoredChunk } from "../vector/types";

export interface RagChatResult {
  answer: string;
  provider: "ollama" | "fallback";
  model?: string;
}

export interface RagChatProvider {
  generateResponse(
    question: string,
    prompt: string,
    chunks: ScoredChunk[],
  ): Promise<RagChatResult>;
}

export class SimpleChatProvider implements RagChatProvider {
  async generateResponse(
    _question: string,
    _prompt: string,
    chunks: ScoredChunk[],
  ): Promise<RagChatResult> {
    if (!chunks.length) {
      return {
        answer: [
          "I could not find enough relevant context in the portfolio knowledge base.",
          "Try rephrasing the question or ask about experience, projects, skills, or availability.",
        ].join(" "),
        provider: "fallback",
      };
    }

    const summary = chunks
      .slice(0, 2)
      .map((entry) => entry.chunk.content.replace(/\s+/g, " ").trim())
      .join(" ");

    return {
      answer: `Based on the available knowledge, ${summary.slice(0, 320)}${summary.length > 320 ? "..." : ""}`,
      provider: "fallback",
    };
  }
}

export class OllamaRagChatProvider implements RagChatProvider {
  constructor(
    private readonly chatProvider = new OllamaChatProvider(),
    private readonly fallback = new SimpleChatProvider(),
  ) {}

  async generateResponse(
    question: string,
    _prompt: string,
    chunks: ScoredChunk[],
  ): Promise<RagChatResult> {
    if (!chunks.length) {
      return this.fallback.generateResponse(question, _prompt, chunks);
    }

    const userPrompt = this.buildCompactPrompt(question, chunks);

    try {
      const response = await this.chatProvider.generate([
        { role: "user", content: userPrompt },
      ]);

      logger.info(
        { model: response.model ?? aiConfig.chatModel },
        "Generated chat response with Ollama",
      );

      return {
        answer: response.message.trim(),
        provider: "ollama",
        model: response.model ?? aiConfig.chatModel,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      logger.error(
        { err: message, model: aiConfig.chatModel },
        "Ollama chat failed; using fallback response",
      );

      const fallback = await this.fallback.generateResponse(question, _prompt, chunks);

      return {
        ...fallback,
        model: aiConfig.chatModel,
      };
    }
  }

  private buildCompactPrompt(question: string, chunks: ScoredChunk[]): string {
    const context = chunks
      .map(
        (entry, index) =>
          `[${index + 1}] ${entry.chunk.metadata.title}\n${entry.chunk.content.slice(0, 700)}`,
      )
      .join("\n\n");

    return [
      "You are a portfolio assistant for Biniyam Tesfu.",
      "Answer ONLY using the context below.",
      "If the answer is not in the context, say you do not have enough information.",
      "Reply in 2-4 concise sentences.",
      "",
      "Context:",
      context,
      "",
      `Question: ${question}`,
    ].join("\n");
  }
}

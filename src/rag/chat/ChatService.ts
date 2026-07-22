import { PromptBuilder } from "../prompts/PromptBuilder";
import { Retriever } from "../retrieval/Retriever";
import { RagChatProvider } from "./ChatProvider";

export interface ChatSource {
  title: string;
  relativePath: string;
  score: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  meta: {
    provider: "ollama" | "fallback";
    model?: string;
  };
}

export class ChatService {
  constructor(
    private readonly retriever: Retriever,
    private readonly promptBuilder: PromptBuilder,
    private readonly chatProvider: RagChatProvider,
  ) {}

  async answer(question: string): Promise<ChatResponse> {
    const scoredChunks = await this.retriever.retrieve(question);
    const prompt = this.promptBuilder.buildPrompt(question, scoredChunks);
    const result = await this.chatProvider.generateResponse(
      question,
      prompt,
      scoredChunks,
    );

    return {
      answer: result.answer,
      sources: this.deduplicateSources(scoredChunks),
      meta: {
        provider: result.provider,
        model: result.model,
      },
    };
  }

  private deduplicateSources(chunks: Awaited<ReturnType<Retriever["retrieve"]>>): ChatSource[] {
    const seen = new Set<string>();

    return chunks.reduce<ChatSource[]>((sources, entry) => {
      const key = entry.chunk.metadata.relativePath || entry.chunk.metadata.source;

      if (seen.has(key)) {
        return sources;
      }

      seen.add(key);

      sources.push({
        title: entry.chunk.metadata.title,
        relativePath: entry.chunk.metadata.relativePath,
        score: Number(entry.score.toFixed(4)),
      });

      return sources;
    }, []);
  }
}

import { aiConfig } from "../../config/ai";
import { ChatMessage } from "../types/ChatMessage";
import { ChatResponse } from "../types/ChatResponse";
import { EmbeddingResult } from "../types/EmbeddingResult";
import { FetchHttpClient, HttpClient } from "./HttpClient";

interface OllamaChatResponse {
  message?: {
    role?: string;
    content?: string;
    thinking?: string;
  };
  model?: string;
}

interface OllamaEmbeddingPayload {
  embedding?: number[];
}

export class OllamaClient {
  constructor(
    private readonly http: HttpClient = new FetchHttpClient(),
    private readonly baseUrl = aiConfig.baseUrl,
  ) {}

  async chat(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      think?: boolean;
    } = {},
  ): Promise<ChatResponse> {
    const model = options.model ?? aiConfig.chatModel;
    const think = options.think ?? aiConfig.thinkEnabled;

    const body: Record<string, unknown> = {
      model,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? aiConfig.temperature,
        num_predict: options.maxTokens ?? aiConfig.maxTokens,
      },
    };

    if (think) {
      body.think = true;
    }

    const response = await this.http.post<OllamaChatResponse>(
      `${this.baseUrl}/api/chat`,
      body,
    );

    const content = response.message?.content?.trim() ?? "";
    const thinking = response.message?.thinking?.trim() ?? "";

    if (!content && thinking) {
      throw new Error("Ollama returned reasoning only; disable thinking or increase AI_MAX_TOKENS");
    }

    if (!content) {
      throw new Error("Ollama returned an empty chat response");
    }

    return {
      message: content,
      model: response.model ?? model,
    };
  }

  async embed(text: string, model = aiConfig.embeddingModel): Promise<EmbeddingResult> {
    const normalized = text.trim();

    if (!normalized) {
      return { vector: [] };
    }

    const response = await this.http.post<OllamaEmbeddingPayload>(
      `${this.baseUrl}/api/embeddings`,
      {
        model,
        prompt: normalized,
        input: normalized,
      },
    );

    if (!response.embedding?.length) {
      throw new Error("Ollama returned an empty embedding");
    }

    return { vector: response.embedding };
  }
}

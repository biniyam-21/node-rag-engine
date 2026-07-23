import OpenAI from "openai";
import { aiConfig } from "../../config/ai";

export class OpenRouterClient {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY || aiConfig.openrouter.apiKey;
    this.client = new OpenAI({
      apiKey: apiKey || "dummy-key-if-missing",
      baseURL: aiConfig.openrouter.baseUrl,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Portfolio RAG System",
      },
    });
  }

  getClient(): OpenAI {
    return this.client;
  }
}

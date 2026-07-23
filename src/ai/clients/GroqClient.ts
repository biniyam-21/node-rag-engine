import OpenAI from "openai";

export class GroqClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  getClient() {
    return this.client;
  }
}

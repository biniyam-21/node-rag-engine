import { aiConfig } from "../../../config/ai";
import { OllamaClient } from "../../clients/OllamaClient";
import { ChatProvider } from "../../providers/ChatProvider";
import { ChatMessage } from "../../types/ChatMessage";
import { ChatResponse } from "../../types/ChatResponse";

export class OllamaChatProvider implements ChatProvider {
  constructor(private readonly client = new OllamaClient()) {}

  async generate(messages: ChatMessage[]): Promise<ChatResponse> {
    return this.client.chat(messages, {
      model: aiConfig.chatModel,
      temperature: aiConfig.temperature,
      maxTokens: aiConfig.maxTokens,
    });
  }
}

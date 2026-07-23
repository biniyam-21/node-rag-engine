import { ChatProvider } from "./ChatProvider";
import { OpenRouterClient } from "../clients/OpenRouterClient";
import { ChatMessage } from "../types/ChatMessage";
import { ChatResponse } from "../types/ChatResponse";
import { aiConfig } from "../../config/ai";

export class OpenRouterChatProvider implements ChatProvider {
  private client: OpenRouterClient;

  constructor() {
    this.client = new OpenRouterClient();
  }

  async generate(messages: ChatMessage[]): Promise<ChatResponse> {
    const formattedMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    const completion = await this.client.getClient().chat.completions.create({
      model: aiConfig.chatModel,
      messages: formattedMessages,
      temperature: aiConfig.temperature,
      max_tokens: aiConfig.maxTokens,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";

    return {
      message: content,
      model: completion.model || aiConfig.chatModel,
    };
  }
}

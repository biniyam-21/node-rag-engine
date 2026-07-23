import { ChatProvider } from "./ChatProvider";
import { GroqClient } from "../clients/GroqClient";
import { ChatMessage } from "../types/ChatMessage";
import { ChatResponse } from "../types/ChatResponse";
import { aiConfig } from "../../config/ai";

export class GroqChatProvider implements ChatProvider {
  private client: GroqClient;

  constructor() {
    this.client = new GroqClient();
  }

  async generate(messages: ChatMessage[]): Promise<ChatResponse> {
    const formattedMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    const completion = await this.client.getClient().chat.completions.create({
      model: aiConfig.chatModel || "llama-3.1-70b-versatile",
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

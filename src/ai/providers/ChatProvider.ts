import { ChatMessage } from "../types/ChatMessage";
import { ChatResponse } from "../types/ChatResponse";

export interface ChatProvider {
  generate(messages: ChatMessage[]): Promise<ChatResponse>;
}

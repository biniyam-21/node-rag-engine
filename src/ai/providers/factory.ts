import { OpenRouterChatProvider } from "./OpenRouterChatProvider";
import { OllamaChatProvider } from "./OllamaChatProvider";
import { OpenRouterEmbeddingProvider } from "./OpenRouterEmbeddingProvider";
import { OllamaEmbeddingProvider } from "./OllamaEmbeddingProvider";
import { GroqChatProvider } from "./GroqChatProvider";
import { GroqEmbeddingProvider } from "./GroqEmbeddingProvider";
import { ChatProvider } from "./ChatProvider";
import { EmbeddingProvider } from "./EmbeddingProvider";
import { aiConfig } from "../../config/ai";

export function createChatProvider(): ChatProvider {
  const provider = aiConfig.provider;

  if (provider === "openrouter") return new OpenRouterChatProvider();
  if (provider === "groq") return new GroqChatProvider();
  if (provider === "ollama") return new OllamaChatProvider();
  return new OpenRouterChatProvider();
}

export function createEmbeddingProvider(): EmbeddingProvider {
  const provider = aiConfig.provider;

  if (provider === "openrouter") return new OpenRouterEmbeddingProvider();
  if (provider === "groq") return new GroqEmbeddingProvider();
  if (provider === "ollama") return new OllamaEmbeddingProvider();
  return new OpenRouterEmbeddingProvider();
}

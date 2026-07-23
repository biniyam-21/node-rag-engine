import "../src/loadEnv";
import { getChatService, initializeRagPipeline } from "../src/container/services";
import { aiConfig } from "../src/config/ai";

async function main() {
  console.log("========================================");
  console.log("Testing OpenRouter RAG Setup");
  console.log("Provider      :", aiConfig.provider);
  console.log("Chat Model    :", aiConfig.chatModel);
  console.log("Embed Model   :", aiConfig.embeddingModel);
  console.log("========================================\n");

  console.log("Step 1: Running knowledge ingestion...");
  const ingestResult = await initializeRagPipeline(true);
  console.log("Ingestion result:", ingestResult);

  console.log("\nStep 2: Asking question to RAG Chat Service...");
  const chatService = await getChatService();
  const result = await chatService.answer("What core skills and technologies does Biniyam specialize in?");

  console.log("\n--- Answer ---");
  console.log(result.answer);
  console.log("\n--- Meta ---");
  console.log(result.meta);
  console.log("\n--- Sources ---");
  console.log(result.sources);
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

import "dotenv/config";
import { OllamaClient } from "../src/ai/clients/OllamaClient";
import { aiConfig } from "../src/config/ai";

async function main() {
  console.log("Using model:", aiConfig.chatModel);
  console.log("thinkEnabled:", aiConfig.thinkEnabled);

  const client = new OllamaClient();
  const response = await client.chat([
    {
      role: "user",
      content: [
        "You are a portfolio assistant for Biniyam Tesfu.",
        "Answer ONLY using the context below. Reply in 2-4 sentences.",
        "",
        "Context:",
        "[1] Skills",
        "Languages: TypeScript, JavaScript, Java, SQL, Python.",
        "Frontend: React, Next.js, Tailwind CSS.",
        "Backend: Node.js, Express, Prisma, PostgreSQL.",
        "",
        "Question: What technologies and skills does Biniyam use?",
      ].join("\n"),
    },
  ]);

  console.log(JSON.stringify(response, null, 2));
}

main().catch((error) => {
  console.error("FAILED:", error);
  process.exit(1);
});

import "../src/loadEnv";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const candidates = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "poolside/laguna-s-2.1:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

async function testAll() {
  for (const model of candidates) {
    try {
      console.log(`\n--- Testing ${model} ---`);
      const completion = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: "You are a portfolio assistant. Explain Biniyam's backend engineering skills in 2 sentences.",
          },
        ],
      });
      console.log("RESPONSE:", completion.choices[0]?.message?.content);
    } catch (err: any) {
      console.error("ERROR:", err.message);
    }
  }
}

testAll();

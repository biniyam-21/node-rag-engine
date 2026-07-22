import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { TextSplitter } from "../src/rag/chunking/TextSplitter";
import { MarkdownLoader } from "../src/rag/loaders/MarkdownLoader";

test("TextSplitter returns multiple chunks for large text", () => {
  const splitter = new TextSplitter(180, 30);
  const text = Array.from({ length: 40 }, (_, index) => `sentence ${index + 1}`).join(" ");

  const chunks = splitter.split(text);

  assert.ok(chunks.length >= 2, "expected the text to be split into multiple chunks");
  assert.ok(chunks.every((chunk) => chunk.trim().length > 0));
});

test("MarkdownLoader loads documents from the knowledge directory", async () => {
  const loader = new MarkdownLoader(path.join(process.cwd(), "knowledge"));
  const documents = await loader.loadAll();

  assert.ok(documents.length > 0, "expected markdown documents to be discovered");
  assert.ok(documents.some((document) => document.content.trim().length > 0));
});

import { paths } from "../../config/paths";
import { ragConfig } from "../../config/rag";
import { InMemoryVectorStore } from "./VectorStore";
import { LanceDBVectorStore } from "./LanceDBVectorStore";
import { VectorStore } from "./types";

export async function createVectorStore(): Promise<VectorStore> {
  if (ragConfig.vectorStore === "memory") {
    return new InMemoryVectorStore();
  }

  return LanceDBVectorStore.create(paths.vectorDatabase);
}

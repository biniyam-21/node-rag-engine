import { MarkdownLoader } from "../rag/loaders/MarkdownLoader";
import { TextSplitter } from "../rag/chunking/TextSplitter";
import { OllamaEmbeddingProvider } from "../rag/embeddings/OllamaEmbeddingProvider";
import { paths } from "../config/paths";

const loader = new MarkdownLoader(paths.knowledge);

const chunker = new TextSplitter();

const embeddingProvider = new OllamaEmbeddingProvider();

export const services = {
  loader,
  chunker,
  embeddingProvider,
};

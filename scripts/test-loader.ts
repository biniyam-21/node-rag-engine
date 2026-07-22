import { MarkdownLoader } from "../src/rag/loaders/MarkdownLoader";
import { paths } from "../src/config/paths";

async function main() {
  const loader = new MarkdownLoader(paths.knowledge);

  const docs = await loader.loadAll();

  console.dir(docs, {
    depth: null,
  });
}

main();

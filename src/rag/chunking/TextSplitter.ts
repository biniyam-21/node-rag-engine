export class TextSplitter {
  constructor(
    private readonly chunkSize = 800,
    private readonly chunkOverlap = 150,
  ) {}

  split(text: string): string[] {
    const normalized = text.replace(/\s+/g, " ").trim();

    if (!normalized) {
      return [];
    }

    if (normalized.length <= this.chunkSize) {
      return [normalized];
    }

    const overlap = Math.min(this.chunkOverlap, this.chunkSize - 1);
    const chunks: string[] = [];
    let start = 0;

    while (start < normalized.length) {
      let end = Math.min(normalized.length, start + this.chunkSize);

      if (end < normalized.length) {
        const boundary = normalized.lastIndexOf(" ", end);

        if (boundary > start) {
          end = boundary;
        }
      }

      const chunk = normalized.slice(start, end).trim();

      if (chunk) {
        chunks.push(chunk);
      }

      if (end >= normalized.length) {
        break;
      }

      start = Math.max(start + 1, end - overlap);
    }

    return chunks.filter(Boolean);
  }
}

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import fg from "fast-glob";
import matter from "gray-matter";

import { Document } from "../types/Document";
import { DocumentLoader } from "../types/DocumentLoader";
import { DocumentMetadata } from "../types/DocumentMetadata";

export class MarkdownLoader implements DocumentLoader {
  constructor(private readonly knowledgePath: string) {}

  async loadAll(): Promise<Document[]> {
    const files = await this.findMarkdownFiles();
    const documents: Document[] = [];

    for (const file of files) {
      documents.push(await this.createDocument(file));
    }

    return documents;
  }

  async loadByPath(relativePath: string): Promise<Document | null> {
    const absolutePath = path.resolve(this.knowledgePath, relativePath);

    if (!absolutePath.startsWith(path.resolve(this.knowledgePath))) {
      return null;
    }

    try {
      await fs.access(absolutePath);
      return this.createDocument(absolutePath);
    } catch {
      return null;
    }
  }

  private async findMarkdownFiles(): Promise<string[]> {
    return fg("**/*.md", {
      cwd: this.knowledgePath,
      absolute: true,
    });
  }

  private async readMarkdown(file: string): Promise<string> {
    return fs.readFile(file, "utf-8");
  }

  private async createDocument(file: string): Promise<Document> {
    const markdown = await this.readMarkdown(file);
    const parsed = matter(markdown);
    const content = parsed.content.trim();
    const relativePath = path.relative(this.knowledgePath, file);

    return {
      content,
      hash: this.createContentHash(content),
      wordCount: content ? content.split(/\s+/).length : 0,
      characterCount: content.length,
      metadata: await this.createMetadata(file, relativePath, parsed.data),
    };
  }

  private async createMetadata(
    file: string,
    relativePath: string,
    frontMatter: Record<string, unknown>,
  ): Promise<DocumentMetadata> {
    const stats = await fs.stat(file);

    return {
      id: this.createDocumentId(relativePath),
      title: typeof frontMatter.title === "string"
        ? frontMatter.title
        : path.basename(file, ".md"),
      category: typeof frontMatter.category === "string"
        ? frontMatter.category
        : "general",
      tags: Array.isArray(frontMatter.tags)
        ? frontMatter.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
      source: file,
      relativePath,
      lastModified: stats.mtime,
    };
  }

  private createContentHash(content: string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  private createDocumentId(relativePath: string): string {
    return crypto
      .createHash("sha256")
      .update(relativePath)
      .digest("hex")
      .slice(0, 16);
  }
}

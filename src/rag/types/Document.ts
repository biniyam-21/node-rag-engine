import { DocumentMetadata } from "./DocumentMetadata";

export interface Document {
  content: string;

  metadata: DocumentMetadata;

  hash: string;

  wordCount: number;

  characterCount: number;
}

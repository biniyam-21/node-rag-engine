export interface DocumentMetadata {
  id: string;

  title: string;

  category: string;

  source: string;

  relativePath: string;

  tags: string[];

  lastModified: Date;
}

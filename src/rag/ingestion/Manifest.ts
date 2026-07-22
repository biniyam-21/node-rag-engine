export interface DocumentManifestEntry {
  relativePath: string;
  hash: string;
  documentId: string;
}

export interface Manifest {
  documents: DocumentManifestEntry[];
  ingestedAt: string;
}

import { Document } from "./Document";

export interface DocumentLoader {
  loadAll(): Promise<Document[]>;
  loadByPath(relativePath: string): Promise<Document | null>;
}

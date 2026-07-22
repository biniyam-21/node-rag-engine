import fs from "node:fs/promises";
import path from "node:path";

import { Manifest } from "./Manifest";

export class ManifestStore {
  constructor(private readonly manifestPath: string) {}

  async read(): Promise<Manifest | null> {
    try {
      const content = await fs.readFile(this.manifestPath, "utf-8");
      return JSON.parse(content) as Manifest;
    } catch {
      return null;
    }
  }

  async write(manifest: Manifest): Promise<void> {
    await fs.mkdir(path.dirname(this.manifestPath), { recursive: true });
    await fs.writeFile(this.manifestPath, JSON.stringify(manifest, null, 2));
  }
}

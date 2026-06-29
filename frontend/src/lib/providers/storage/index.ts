import type { UploadResult } from "./types";

export interface StorageProvider {
  upload(
    file: Buffer,
    path: string,
    contentType: string
  ): Promise<UploadResult>;

  delete(fileId: string): Promise<void>;

  getUrl(path: string): string;
}

let provider: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!provider) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ImageKitProvider } = require("./imagekit");
    provider = new ImageKitProvider();
  }
  return provider!;
}

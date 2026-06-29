import type { StorageProvider } from "./index";
import type { UploadResult } from "./types";

export class ImageKitProvider implements StorageProvider {
  private endpoint: string;
  private publicKey: string;
  private privateKey: string;

  constructor() {
    this.endpoint = process.env.IMAGEKIT_ENDPOINT ?? "";
    this.publicKey = process.env.IMAGEKIT_PUBLIC_KEY ?? "";
    this.privateKey = process.env.IMAGEKIT_PRIVATE_KEY ?? "";
  }

  async upload(
    file: Buffer,
    path: string,
    _contentType: string
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", new Blob([new Uint8Array(file)]));
    formData.append("fileName", path.split("/").pop() ?? "file");
    formData.append("folder", path.substring(0, path.lastIndexOf("/")));

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(this.privateKey + ":").toString("base64")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImageKit upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { url: data.url, fileId: data.fileId };
  }

  async delete(fileId: string): Promise<void> {
    const response = await fetch(
      `https://api.imagekit.io/v1/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(this.privateKey + ":").toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ImageKit delete failed: ${response.statusText}`);
    }
  }

  getUrl(path: string): string {
    return `${this.endpoint}/${path}`;
  }
}

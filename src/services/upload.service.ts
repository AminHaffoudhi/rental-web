import { api, getApiErrorDetail, unwrap } from "@/services/api";

export type UploadFolder = "equipment" | "avatars" | "kyc" | "delivery";

export interface SignUploadResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string | null;
  bucket: string;
  expiresIn: number;
}

export interface UploadResult {
  fileKey: string;
  bucket: string;
  url: string;
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

/**
 * Upload through the API (no direct browser → MinIO request).
 * Avoids MinIO CORS / connection issues when Vite uses another port.
 */
export async function uploadFile(
  file: File,
  folder: UploadFolder,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const contentType =
    file.type ||
    (file.name.toLowerCase().endsWith(".pdf")
      ? "application/pdf"
      : folder === "kyc"
        ? "application/octet-stream"
        : "image/jpeg");

  try {
    const res = await api.post("/upload/direct", file, {
      headers: {
        "Content-Type": contentType,
        "X-File-Name": encodeURIComponent(file.name),
        "X-Upload-Folder": folder,
        "X-File-Size": String(file.size),
      },
      transformRequest: [(data) => data],
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress({
            percent: Math.round((evt.loaded / evt.total) * 100),
            loaded: evt.loaded,
            total: evt.total,
          });
        }
      },
    });
    const data = unwrap(res) as { url: string; fileKey: string; bucket: string };
    return { fileKey: data.fileKey, bucket: data.bucket, url: data.url };
  } catch (err) {
    const { message } = getApiErrorDetail(err);
    if (message.includes("ECONNREFUSED") || message.toLowerCase().includes("network")) {
      throw new Error(
        "Storage server is unavailable. Start MinIO (port 9000) and restart rental-api."
      );
    }
    throw new Error(message);
  }
}

export async function uploadFiles(
  files: File[],
  folder: UploadFolder,
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadFile(files[i], folder, (p) => onProgress?.(i, p));
    results.push(result);
  }
  return results;
}

/** @deprecated Prefer `uploadFile` (API proxy). */
export async function getPresignedUpload(params: {
  folder?: string;
  contentType: string;
  filename?: string;
  fileSize?: number;
}): Promise<SignUploadResponse & { key: string }> {
  const res = await api.post("/upload/presign", params);
  const data = unwrap(res) as {
    uploadUrl: string;
    publicUrl: string | null;
    key: string;
    bucket?: string;
    expiresIn: number;
  };
  return {
    uploadUrl: data.uploadUrl,
    publicUrl: data.publicUrl,
    fileKey: data.key,
    key: data.key,
    bucket: data.bucket ?? "",
    expiresIn: data.expiresIn,
  };
}

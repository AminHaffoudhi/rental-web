import { useCallback, useState } from "react";
import { uploadFile, type UploadFolder, type UploadProgress } from "@/services/upload.service";

export type UseUploadOptions = {
  folder?: UploadFolder;
};

export function useUpload(options: UseUploadOptions | UploadFolder = "equipment") {
  const folder: UploadFolder =
    typeof options === "string" ? options : (options.folder ?? "equipment");

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setProgress(0);
      try {
        const result = await uploadFile(file, folder, (p: UploadProgress) => {
          setProgress(p.percent);
        });
        return result.url;
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [folder]
  );

  return { upload, isUploading, progress };
}

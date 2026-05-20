import { useCallback, useRef, useState, type DragEvent } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile, type UploadFolder, type UploadProgress } from "@/services/upload.service";
import { cn } from "@/utils/cn";

function padKeys(urls: string[], keys: string[] | undefined): string[] {
  const k = [...(keys ?? [])];
  while (k.length < urls.length) k.push("");
  return k.slice(0, urls.length);
}

type PendingStatus = "pending" | "uploading" | "done" | "error";

interface PendingFile {
  file: File;
  preview: string;
  progress: number;
  status: PendingStatus;
  error: string | null;
}

export interface ImageUploaderProps {
  folder: UploadFolder;
  maxFiles?: number;
  accept?: string;
  label?: string;
  hint?: string;
  valueUrls: string[];
  valueKeys?: string[];
  onChange: (urls: string[], keys: string[]) => void;
  className?: string;
}

export function ImageUploader({
  folder,
  maxFiles = 8,
  accept = "image/*",
  label = "Upload images",
  hint,
  valueUrls,
  valueKeys = [],
  onChange,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const usedSlots = valueUrls.length + pending.length;
  const canAddMore = usedSlots < maxFiles;

  const addFiles = useCallback(
    (incoming: File[]) => {
      const remaining = maxFiles - usedSlots;
      const slice = incoming.slice(0, Math.max(0, remaining));
      if (incoming.length > remaining) {
        toast.error(`Maximum ${maxFiles} files allowed`);
      }
      setPending((prev) => [
        ...prev,
        ...slice.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "pending" as const,
          error: null,
        })),
      ]);
    },
    [maxFiles, usedSlots]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removePending = (index: number) => {
    setPending((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

  const removeExisting = (index: number) => {
    const urls = valueUrls.filter((_, i) => i !== index);
    const keys = padKeys(valueUrls, valueKeys).filter((_, i) => i !== index);
    onChange(urls, keys);
  };

  const uploadAllPending = async () => {
    const indices = pending.map((p, i) => (p.status === "pending" ? i : -1)).filter((i) => i >= 0);
    if (!indices.length) return;

    setIsUploading(true);
    let urls = [...valueUrls];
    let keys = padKeys(valueUrls, valueKeys);

    for (const idx of indices) {
      const file = pending[idx]?.file;
      if (!file) continue;

      setPending((prev) =>
        prev.map((p, i) => (i === idx ? { ...p, status: "uploading" as const, progress: 0 } : p))
      );

      try {
        const result = await uploadFile(file, folder, (p: UploadProgress) => {
          setPending((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, progress: p.percent } : item))
          );
        });
        urls = [...urls, result.url];
        keys = [...keys, result.fileKey];
        onChange(urls, keys);
        setPending((prev) =>
          prev.map((p, i) =>
            i === idx ? { ...p, status: "done" as const, progress: 100 } : p
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setPending((prev) =>
          prev.map((p, i) => (i === idx ? { ...p, status: "error" as const, error: message } : p))
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);

    setPending((prev) => {
      for (const p of prev) {
        if (p.status === "done") URL.revokeObjectURL(p.preview);
      }
      return prev.filter((p) => p.status !== "done");
    });
  };

  const hasPending = pending.some((p) => p.status === "pending");

  return (
    <div className={cn("space-y-3", className)}>
      {canAddMore ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 p-8 text-center transition-all duration-200 hover:border-brand-400 hover:bg-brand-50/50 active:scale-[0.99]"
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-stone-100 transition-colors hover:bg-brand-100">
              <Upload size={24} className="text-stone-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-700">{label}</p>
              <p className="mt-1 text-xs text-stone-400">
                {hint ||
                  `Drag & drop or click to browse · Max ${maxFiles} file${maxFiles > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {valueUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {valueUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-stone-100 bg-stone-50"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-sm">
                <CheckCircle size={14} className="text-white" />
              </div>
              <button
                type="button"
                onClick={() => removeExisting(index)}
                className="absolute left-2 top-2 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {pending.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {pending.map((entry, index) => (
            <FilePreviewCard
              key={entry.preview}
              entry={entry}
              onRemove={() => removePending(index)}
            />
          ))}
        </div>
      ) : null}

      {hasPending ? (
        <button
          type="button"
          onClick={() => void uploadAllPending()}
          disabled={isUploading}
          className="btn btn-primary flex min-h-[44px] w-full items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload {pending.filter((p) => p.status === "pending").length} file
              {pending.filter((p) => p.status === "pending").length > 1 ? "s" : ""}
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}

function FilePreviewCard({
  entry,
  onRemove,
}: {
  entry: PendingFile;
  onRemove: () => void;
}) {
  const isPDF = entry.file.type === "application/pdf";

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
      {isPDF ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <span className="text-xs font-bold text-red-600">PDF</span>
          </div>
          <p className="w-full truncate px-2 text-center text-xs text-stone-500">{entry.file.name}</p>
        </div>
      ) : (
        <img src={entry.preview} alt="" className="h-full w-full object-cover" />
      )}

      {entry.status === "uploading" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
          <div className="h-10 w-10 min-h-[44px] min-w-[44px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span className="text-xs font-bold text-white">{entry.progress}%</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${entry.progress}%` }}
            />
          </div>
        </div>
      ) : null}

      {entry.status === "done" ? (
        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-sm">
          <CheckCircle size={14} className="text-white" />
        </div>
      ) : null}

      {entry.status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-500/80 p-2">
          <AlertCircle size={20} className="text-white" />
          <p className="text-center text-xs leading-tight text-white">{entry.error || "Failed"}</p>
        </div>
      ) : null}

      {entry.status !== "uploading" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute left-2 top-2 flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Remove file"
        >
          <X size={12} className="text-white" />
        </button>
      ) : null}
    </div>
  );
}

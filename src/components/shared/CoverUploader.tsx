import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CoverCropDialog } from "@/components/shared/CoverCropDialog";
import { uploadFile } from "@/services/upload.service";
import { cn } from "@/utils/cn";

interface CoverUploaderProps {
  currentUrl?: string | null;
  name: string;
  onUpload: (url: string) => void | Promise<void>;
  className?: string;
  readOnly?: boolean;
}

export function coverGradient(name: string): string {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0);
  const hue = 18 + (code % 280);
  return `linear-gradient(135deg, hsl(${hue} 72% 42%) 0%, hsl(${hue + 35} 65% 58%) 50%, hsl(${hue + 70} 55% 38%) 100%)`;
}

export function CoverUploader({
  currentUrl,
  name,
  onUpload,
  className,
  readOnly = false,
}: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  function closeCrop() {
    setCropOpen(false);
    if (cropSrc) {
      URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
    }
  }

  function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("Image must be under 12MB (you can crop before upload)");
      return;
    }
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
  }

  async function handleCroppedUpload(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadFile(file, "covers", (p) => setProgress(p.percent));
      await onUpload(result.url);
      toast.success("Cover image updated");
    } catch {
      toast.error("Failed to upload cover");
      throw new Error("upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <CoverCropDialog
        open={cropOpen}
        imageSrc={cropSrc ?? ""}
        onOpenChange={(open) => {
          if (!open) closeCrop();
        }}
        onConfirm={handleCroppedUpload}
      />

      <div
        className="relative aspect-[21/7] min-h-[140px] w-full md:min-h-[180px]"
        style={!currentUrl ? { background: coverGradient(name) } : undefined}
      >
        {currentUrl ? (
          <img src={currentUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {!readOnly ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploading || cropOpen}
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-stone-800 shadow-md backdrop-blur-sm transition hover:bg-white disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {progress > 0 ? `${progress}%` : "Uploading…"}
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" aria-hidden />
                  Change cover
                </>
              )}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

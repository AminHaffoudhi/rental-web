import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { AvatarCropDialog } from "@/components/shared/AvatarCropDialog";
import { uploadFile } from "@/services/upload.service";
import { cn } from "@/utils/cn";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  name: string;
  onUpload: (url: string) => void;
  size?: "md" | "lg";
  className?: string;
}

export function AvatarUploader({
  currentUrl,
  name,
  onUpload,
  size = "lg",
  className,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sizeClass = size === "lg" ? "h-24 w-24 min-h-[44px] min-w-[44px]" : "h-16 w-16 min-h-[44px] min-w-[44px]";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
      toast.error("Image must be under 12MB (it will be cropped before upload)");
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
      const result = await uploadFile(file, "avatars", (p) => setProgress(p.percent));
      onUpload(result.url);
      toast.success("Profile photo updated");
    } catch {
      toast.error("Failed to upload photo");
      throw new Error("upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  const displayUrl = currentUrl;

  return (
    <div className={cn("relative inline-block", className)}>
      <AvatarCropDialog
        open={cropOpen}
        imageSrc={cropSrc ?? ""}
        onOpenChange={(open) => {
          if (!open) closeCrop();
        }}
        onConfirm={handleCroppedUpload}
      />

      <div
        className={cn(
          sizeClass,
          "group relative cursor-pointer overflow-hidden rounded-full border-4 border-white bg-brand-100 shadow-md",
          "flex items-center justify-center"
        )}
        onClick={() => !uploading && !cropOpen && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!uploading && !cropOpen && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {displayUrl ? (
          <img src={displayUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-xl font-bold text-brand-600">{initials}</span>
        )}

        {!uploading && !cropOpen ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={20} className="text-white" />
          </div>
        ) : null}

        {uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/60">
            <Loader2 size={20} className="animate-spin text-white" />
            <span className="text-xs font-bold text-white">{progress}%</span>
          </div>
        ) : null}
      </div>

      {!uploading && !cropOpen ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-white bg-brand-500 shadow-md transition-colors hover:bg-brand-600"
          aria-label="Change profile photo"
        >
          <Camera size={14} className="text-white" />
        </button>
      ) : null}

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
    </div>
  );
}

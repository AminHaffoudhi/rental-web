import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
  alt?: string;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
  alt = "Photo",
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || images.length === 0) return null;

  const src = images[index];

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/95"
      role="dialog"
      aria-modal
      aria-label="Image viewer"
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white">
        <p className="text-sm font-medium tabular-nums">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-canvas-card/20"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        <button
          type="button"
          className="absolute inset-0 z-0"
          aria-label="Close viewer"
          onClick={onClose}
        />
        {images.length > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-canvas-card/25 sm:left-6"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : null}

        <img
          src={src}
          alt={`${alt} — ${index + 1}`}
          className="relative z-[1] max-h-[min(80vh,900px)] max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-canvas-card/25 sm:right-6"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-6 pt-2">
          {images.map((thumb, i) => (
            <button
              key={`${thumb}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                i === index ? "border-brand-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>,
    document.body
  );
}

/** Hint overlay on clickable gallery images */
export function GalleryZoomHint({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm",
        className
      )}
    >
      <ZoomIn className="h-3.5 w-3.5" aria-hidden />
      Click to enlarge
    </span>
  );
}

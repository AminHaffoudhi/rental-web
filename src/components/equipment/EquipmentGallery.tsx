import { useState } from "react";
import { cn } from "@/utils/cn";

interface EquipmentGalleryProps {
  images: string[];
  title: string;
}

export function EquipmentGallery({ images, title }: EquipmentGalleryProps) {
  const [main, setMain] = useState(0);
  const safe = images.length ? images : [];

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
        {safe.length ? (
          <img src={safe[main]} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No photos
          </div>
        )}
      </div>
      {safe.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safe.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setMain(i)}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                main === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

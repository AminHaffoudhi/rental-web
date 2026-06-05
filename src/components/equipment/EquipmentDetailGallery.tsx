import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { GalleryZoomHint, ImageLightbox } from "@/components/shared/ImageLightbox";
import { CategoryIcon } from "@/components/equipment/CategoryIcon";
import type { Equipment } from "@/types/equipment";
import { cn } from "@/utils/cn";

interface EquipmentDetailGalleryProps {
  equipment: Equipment;
}

export function EquipmentDetailGallery({ equipment }: EquipmentDetailGalleryProps) {
  const imgs = equipment.images.filter(Boolean);
  const [main, setMain] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const cat = equipment.category;

  function goPrev() {
    setMain((i) => (i <= 0 ? imgs.length - 1 : i - 1));
  }

  function goNext() {
    setMain((i) => (i >= imgs.length - 1 ? 0 : i + 1));
  }

  if (!imgs.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-stone-200 bg-gradient-to-br from-brand-50 to-stone-50 md:aspect-[16/9]">
        <CategoryIcon
          iconUrl={cat?.iconUrl}
          name={cat?.name}
          className="h-24 w-24 text-brand-300"
          imgClassName="h-24 w-24"
        />
      </div>
    );
  }

  const hasMany = imgs.length > 1;

  return (
    <>
      <div className="space-y-3">
        <div className="group relative overflow-hidden rounded-2xl bg-stone-900 shadow-md">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="block w-full cursor-zoom-in text-left"
            aria-label="Open full screen gallery"
          >
            <div className="aspect-[4/3] md:aspect-[16/9]">
              <img
                src={imgs[main]}
                alt={equipment.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <GalleryZoomHint />
          </button>

          {hasMany ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas-card/95 text-stone-800 shadow-elevated transition-opacity hover:bg-canvas-card dark:text-stone-100"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas-card/95 text-stone-800 shadow-elevated transition-opacity hover:bg-canvas-card dark:text-stone-100"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {main + 1} / {imgs.length}
              </span>
            </>
          ) : null}
        </div>

        {hasMany ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imgs.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => {
                  setMain(i);
                  setLightboxOpen(true);
                }}
                className={cn(
                  "h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                  main === i
                    ? "border-brand-500 ring-2 ring-brand-500/20"
                    : "border-transparent opacity-75 hover:opacity-100"
                )}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ImageLightbox
        images={imgs}
        initialIndex={main}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        alt={equipment.title}
      />
    </>
  );
}

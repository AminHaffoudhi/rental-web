import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCroppedImageBlob } from "@/utils/cropImage";

/** Matches profile cover display (21:7). */
export const COVER_CROP_ASPECT = 21 / 7;

/** Exported width for cropped JPEG (21:7). */
const COVER_OUTPUT_WIDTH = 1260;
const COVER_OUTPUT_HEIGHT = 420;

interface CoverCropDialogProps {
  open: boolean;
  imageSrc: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void | Promise<void>;
}

export function CoverCropDialog({
  open,
  imageSrc,
  onOpenChange,
  onConfirm,
}: CoverCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      });
    }
  }, [open, imageSrc]);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleSave() {
    if (!croppedAreaPixels || !imageSrc) return;
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(
        imageSrc,
        croppedAreaPixels,
        COVER_OUTPUT_WIDTH,
        COVER_OUTPUT_HEIGHT
      );
      const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
      await onConfirm(file);
      onOpenChange(false);
    } catch {
      // Parent handles errors; keep dialog open for retry.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 pb-2 pt-6">
          <DialogTitle>Adjust cover image</DialogTitle>
          <DialogDescription>
            Drag to reposition and use the slider to zoom. The frame matches how your cover
            appears on your public profile.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[min(50vw,220px)] w-full bg-stone-900 sm:h-[240px]">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={COVER_CROP_ASPECT}
              cropShape="rect"
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : null}
        </div>

        <div className="space-y-2 px-6 py-4">
          <label className="text-xs font-medium text-stone-600" htmlFor="cover-crop-zoom">
            Zoom
          </label>
          <input
            id="cover-crop-zoom"
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-11 w-full cursor-pointer accent-brand-500"
          />
        </div>

        <DialogFooter className="gap-2 border-t border-stone-200 bg-canvas-card px-6 py-4 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="min-h-[44px]"
            disabled={saving || !croppedAreaPixels}
            onClick={() => void handleSave()}
          >
            {saving ? "Saving…" : "Save cover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

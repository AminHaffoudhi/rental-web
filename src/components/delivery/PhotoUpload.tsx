import { useState } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";

interface PhotoUploadProps {
  existingPhotos: string[];
  onUpload: (urls: string[]) => void;
}

export function PhotoUpload({ existingPhotos, onUpload }: PhotoUploadProps) {
  const [newUrls, setNewUrls] = useState<string[]>([]);
  const [newKeys, setNewKeys] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {existingPhotos.map((url) => (
          <img
            key={url}
            src={url}
            alt=""
            className="aspect-square rounded-md border object-cover"
          />
        ))}
      </div>
      <ImageUploader
        folder="delivery"
        maxFiles={12}
        accept="image/*"
        label="Add condition photos"
        valueUrls={newUrls}
        valueKeys={newKeys}
        onChange={(urls, keys) => {
          setNewUrls(urls);
          setNewKeys(keys);
          onUpload(urls);
        }}
      />
    </div>
  );
}

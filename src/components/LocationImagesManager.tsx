import type { LocationImage } from "../types/location";
import { UPLOADS_URL } from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLocationImage, uploadLocationImage } from "../api/locationApi";
import { useRef } from "react";

type Props = {
  locationId: number;
  images: LocationImage[];
};

export default function LocationImagesManager({ locationId, images }: Props) {
  const queryClient = useQueryClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => deleteLocationImage(locationId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations", "location", locationId] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadLocationImage(locationId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations", "location", locationId] });
    },
  });

  return (
    <div className="flex gap-2 overflow-x-auto my-4">
      {images.map((image) => (
        <div key={image.id} className="relative w-48 h-48 shrink-0 rounded-md overflow-hidden">
          <img
            src={`${UPLOADS_URL}/locations/${image.filename}`}
            alt=""
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => {
              deleteMutation.mutate(image.id);
            }}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Upload */}
      <div
        onClick={() => inputRef.current?.click()}
        className="w-48 h-48 shrink-0 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadMutation.mutate(file);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        <span className="text-2xl text-slate-400">+</span>
      </div>
    </div>
  );
}

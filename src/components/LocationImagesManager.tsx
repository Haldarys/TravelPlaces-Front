import type { LocationImage } from "../types/location";
import { UPLOADS_URL } from "../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLocationImage, reorderLocationImage, uploadLocationImage } from "../api/locationApi";
import { useEffect, useRef, useState } from "react";
import { Sortable } from "./ui/Sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { toast } from "react-toastify";

type Props = {
  locationId: number;
  images: LocationImage[];
};

export default function LocationImagesManager({ locationId, images }: Props) {
  const queryClient = useQueryClient();
  images.sort((a, b) => a.position - b.position);

  const inputRef = useRef<HTMLInputElement>(null);

  const [localImages, setLocalImages] = useState<LocationImage[]>(images);

  const hasOrderChanged = localImages.some((img, i) => img.id !== images[i]?.id);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => deleteLocationImage(locationId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations", "location", locationId] });
      toast("Image supprimée avec succès");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadLocationImage(locationId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations", "location", locationId] });
      toast("Image uploadée avec succès");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (toUpdate: { id: number; position: number }[]) =>
      reorderLocationImage(locationId, toUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations", "location", locationId] });
      toast("Ordre sauvegardé");
    },
  });

  const handleSaveOrder = () => {
    const toUpdate: { id: number; position: number }[] = [];
    localImages.forEach((image, index) => {
      if (image.position !== index) {
        toUpdate.push({ id: image.id, position: index });
      }
    });
    reorderMutation.mutate(toUpdate);
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto my-4">
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;
            const { source } = event.operation;

            if (isSortable(source)) {
              const { initialIndex, index } = source;

              if (initialIndex !== index) {
                setLocalImages((localImages) => {
                  const newLocalImages = [...localImages];
                  const [removed] = newLocalImages.splice(initialIndex, 1);
                  newLocalImages.splice(index, 0, removed);
                  return newLocalImages;
                });
              }
            }
          }}
        >
          {localImages.map((image, index) => (
            <Sortable id={image.id} index={index} key={image.id}>
              <div
                key={image.id}
                className="relative w-48 h-48 shrink-0 rounded-md overflow-hidden"
              >
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
            </Sortable>
          ))}
        </DragDropProvider>

        {/* Upload */}
        <div className="flex flex-col">
          <div
            onClick={() => inputRef.current?.click()}
            className="w-48 grow shrink-0 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400"
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
          {hasOrderChanged && (
            <button className="btn ms-0 mt-2 shrink-0" onClick={handleSaveOrder}>
              Sauvegarder l'ordre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

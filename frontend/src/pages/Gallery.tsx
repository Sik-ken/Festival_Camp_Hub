import { useEffect, useState } from "react";
import { api, mediaUrl } from "@/lib/api";
import { PageHeader } from "@/components/ui";

interface GalleryPhoto {
  id: number;
  thumbnail_path: string;
  processed_path: string;
  caption: string | null;
  created_at: string;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    api.get<GalleryPhoto[]>("/gallery?limit=90").then(setPhotos).catch(() => setPhotos([]));
  }, []);

  return (
    <div className="pt-2">
      <PageHeader title="Galerie" subtitle={`${photos.length} Fotos vom Camp`} />

      {photos.length === 0 && <p className="text-camp-neutral text-sm">Noch keine Fotos.</p>}

      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="aspect-square rounded-lg overflow-hidden bg-white/5"
          >
            <img src={mediaUrl(p.thumbnail_path)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <img src={mediaUrl(selected.processed_path)} alt="" className="max-w-full max-h-[80vh] rounded-xl" />
          {selected.caption && <p className="text-white mt-3 text-center">{selected.caption}</p>}
        </div>
      )}
    </div>
  );
}

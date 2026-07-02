import { useEffect, useRef, useState } from "react";
import { api, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, PageHeader } from "@/components/ui";

interface GalleryPhoto {
  id: number;
  thumbnail_path: string;
  processed_path: string;
  caption: string | null;
  created_at: string;
}

const SWIPE_THRESHOLD_PX = 50;

export default function Gallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  function loadPhotos() {
    api.get<GalleryPhoto[]>("/gallery?limit=90").then(setPhotos).catch(() => setPhotos([]));
  }

  useEffect(loadPhotos, []);

  const selected = selectedIndex !== null ? photos[selectedIndex] : null;

  function showPrev() {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }

  function showNext() {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD_PX) showPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) showNext();
  }

  async function downloadPhoto(photo: GalleryPhoto) {
    const res = await fetch(mediaUrl(photo.processed_path));
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `helmpflicht-${photo.id}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deletePhoto(id: number) {
    await api.delete(`/admin/photos/${id}`);
    setSelectedIndex(null);
    loadPhotos();
  }

  return (
    <div className="pt-2">
      <PageHeader title="Galerie" subtitle={`${photos.length} Fotos vom Camp`} />

      {photos.length === 0 && <p className="text-camp-neutral text-sm">Noch keine Fotos.</p>}

      <div className="grid grid-cols-3 gap-1.5">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelectedIndex(i)}
            className="aspect-square rounded-lg overflow-hidden bg-white/5"
          >
            <img src={mediaUrl(p.thumbnail_path)} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 text-3xl text-white/80 px-3 py-4"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
          >
            ‹
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl text-white/80 px-3 py-4"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>

          <img src={mediaUrl(selected.processed_path)} alt="" className="max-w-full max-h-[75vh] rounded-xl" />
          {selected.caption && <p className="text-white mt-3 text-center">{selected.caption}</p>}

          <div className="flex gap-2 mt-4">
            <Button
              variant="secondary"
              className="min-h-10 px-4 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                downloadPhoto(selected);
              }}
            >
              Herunterladen
            </Button>
            {user?.roles.includes("admin") && (
              <Button
                variant="ghost"
                className="text-red-400 min-h-10 px-4 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePhoto(selected.id);
                }}
              >
                Foto löschen
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

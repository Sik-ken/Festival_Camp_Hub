import { useEffect, useState } from "react";
import { api, mediaUrl } from "@/lib/api";
import { PageHeader, Tile } from "@/components/ui";

interface GalleryPhoto {
  id: number;
  thumbnail_path: string;
}

const SLIDESHOW_INTERVAL_MS = 1500;

export default function Home() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get<GalleryPhoto[]>("/gallery/random?count=20").then(setPhotos).catch(() => setPhotos([]));
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % photos.length), SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [photos]);

  return (
    <div className="pt-2">
      <PageHeader title="Camp Helmpflicht" subtitle="Willkommen im Hub – schön, dass du da bist." />

      <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6 flex items-center justify-center">
        {photos.length > 0 ? (
          <img
            src={mediaUrl(photos[index].thumbnail_path)}
            alt=""
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        ) : (
          <span className="text-camp-neutral text-sm">Noch keine Fotos in der Galerie</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Tile to="/photo-booth" label="Fotobox" icon="📸" />
        <Tile to="/friendbook" label="Freundebuch" icon="📖" />
        <Tile to="/tasks" label="Challenges" icon="🧱" />
        <Tile to="/gallery" label="Galerie" icon="🖼️" />
        <Tile to="/funnels" label="Trichterliste" icon="🍺" />
        <Tile to="/leaderboards" label="Ranglisten" icon="🏆" />
        <Tile to="/wall-of-fame" label="Wall of Fame" icon="⭐" />
      </div>
    </div>
  );
}

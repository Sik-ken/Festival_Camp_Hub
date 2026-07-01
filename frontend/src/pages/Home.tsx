import { useEffect, useState } from "react";
import { api, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PageHeader, Tile } from "@/components/ui";

interface GalleryPhoto {
  id: number;
  thumbnail_path: string;
}

interface PublicStats {
  participants: number;
  photos: number;
  challenges_completed: number;
  funnels_total: number;
}

const SLIDESHOW_INTERVAL_MS = 1500;

export default function Home() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    api.get<GalleryPhoto[]>("/gallery/random?count=20").then(setPhotos).catch(() => setPhotos([]));
    api.get<PublicStats>("/stats").then(setStats).catch(() => setStats(null));
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

      {stats && (
        <div className="grid grid-cols-4 gap-2 mb-6">
          <StatBox label="Teilnehmer" value={stats.participants} />
          <StatBox label="Fotos" value={stats.photos} />
          <StatBox label="Challenges" value={stats.challenges_completed} />
          <StatBox label="Trichter" value={stats.funnels_total} />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Tile to="/photo-booth" label="Fotobox" icon="📸" />
        <Tile to="/friendbook" label="Freundebuch" icon="📖" />
        <Tile to="/tasks" label="Challenges" icon="🧱" />
        <Tile to="/gallery" label="Galerie" icon="🖼️" />
        <Tile to="/funnels" label="Trichterliste" icon="🍺" />
        <Tile to="/leaderboards" label="Ranglisten" icon="🏆" />
        <Tile to="/wall-of-fame" label="Wall of Fame" icon="⭐" />
        {user?.roles.includes("admin") && <Tile to="/admin" label="Admin" icon="🛠️" />}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 py-3 text-center">
      <p className="text-lg font-bold text-camp-primary">{value}</p>
      <p className="text-[10px] text-camp-neutral leading-tight">{label}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, PageHeader, Tile } from "@/components/ui";
import InstagramIcon from "@/components/InstagramIcon";

const INSTAGRAM_URL = "https://www.instagram.com/helmpflicht_db";
const INSTAGRAM_HANDLE = "@helmpflicht_db";

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

interface ActivityItem {
  id: number;
  event_type: string;
  message: string;
  created_at: string;
}

const SLIDESHOW_INTERVAL_MS = 1500;

export default function Home() {
  const { user, refresh } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    refresh();
    api.get<GalleryPhoto[]>("/gallery/random?count=20").then(setPhotos).catch(() => setPhotos([]));
    api.get<PublicStats>("/stats").then(setStats).catch(() => setStats(null));
    api.get<ActivityItem[]>("/activity/recent?limit=3").then(setActivity).catch(() => setActivity([]));
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

      {user?.nominated_by_nickname && (
        <div className="mb-6 rounded-2xl bg-red-600 border-2 border-red-400 px-4 py-3 text-center shadow-lg">
          <p className="font-bold text-white text-base leading-snug">
            ⚠️ {user.nickname} du wurdest angezeigt von {user.nominated_by_nickname}! 🚨
          </p>
        </div>
      )}

      {activity.length > 0 && (
        <Card className="mb-6">
          <p className="font-semibold mb-2">Letzte Ereignisse</p>
          <div className="flex flex-col gap-1.5">
            {activity.map((a) => (
              <p key={a.id} className="text-sm text-camp-neutral">
                {a.message}
              </p>
            ))}
          </div>
        </Card>
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

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"
      >
        <InstagramIcon className="w-8 h-8 text-camp-primary shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold">Folgt uns auf Instagram</p>
          <p className="text-sm text-camp-neutral truncate">{INSTAGRAM_HANDLE}</p>
        </div>
      </a>
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

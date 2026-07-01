import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, mediaUrl } from "@/lib/api";
import { Card, PageHeader } from "@/components/ui";

interface FriendbookEntry {
  id: number;
  nickname: string;
  hometown: string;
  first_name: string | null;
  camp_name: string | null;
  crush: string | null;
  favorite_act: string | null;
  favorite_color: string | null;
  profile_photo_path: string;
  points: number;
  level_name: string;
}

interface UserPhoto {
  id: number;
  thumbnail_path: string;
  processed_path: string;
  upload_type: string;
  caption: string | null;
}

export default function FriendbookDetail() {
  const { id } = useParams();
  const [entry, setEntry] = useState<FriendbookEntry | null>(null);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [selected, setSelected] = useState<UserPhoto | null>(null);

  useEffect(() => {
    api.get<FriendbookEntry>(`/friendbook/${id}`).then(setEntry).catch(() => setEntry(null));
    api.get<UserPhoto[]>(`/friendbook/${id}/photos`).then(setPhotos).catch(() => setPhotos([]));
  }, [id]);

  if (!entry) return <p className="pt-4 text-camp-neutral">Lädt…</p>;

  return (
    <div className="pt-2 flex flex-col gap-4">
      <PageHeader title={entry.first_name ? `${entry.nickname} (${entry.first_name})` : entry.nickname} />

      <Card className="flex flex-col items-center gap-2 text-center">
        {entry.profile_photo_path && (
          <img src={mediaUrl(entry.profile_photo_path)} alt="" className="w-24 h-24 rounded-full object-cover" />
        )}
        <p className="text-camp-neutral">{entry.hometown}</p>
        <p className="text-sm text-camp-warm">{entry.level_name} · {entry.points} Punkte</p>
        {entry.camp_name && <p className="text-xs text-camp-neutral">Camp: {entry.camp_name}</p>}
        {entry.favorite_act && <p className="text-xs text-camp-neutral">Fav. Act: {entry.favorite_act}</p>}
        {entry.crush && <p className="text-xs text-camp-neutral">Festival Crush: {entry.crush}</p>}
        {entry.favorite_color && <p className="text-xs text-camp-neutral">Lieblingsfarbe: {entry.favorite_color}</p>}
      </Card>

      <div>
        <p className="font-semibold mb-2">Fotos ({photos.length})</p>
        {photos.length === 0 ? (
          <p className="text-camp-neutral text-sm">Noch keine Fotobox- oder Challenge-Fotos.</p>
        ) : (
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
        )}
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
}

export default function Friendbook() {
  const [entries, setEntries] = useState<FriendbookEntry[]>([]);

  useEffect(() => {
    api.get<FriendbookEntry[]>("/friendbook").then(setEntries).catch(() => setEntries([]));
  }, []);

  return (
    <div className="pt-2 flex flex-col gap-3">
      <PageHeader title="Freundebuch" subtitle={`${entries.length} Einträge`} />
      {entries.map((entry) => (
        <Link key={entry.id} to={`/friendbook/${entry.id}`}>
          <Card className="flex gap-4 items-center hover:bg-white/10 transition">
            {entry.profile_photo_path ? (
              <img
                src={mediaUrl(entry.profile_photo_path)}
                alt=""
                className="w-16 h-16 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-bold text-camp-primary truncate">{entry.nickname}</p>
              <p className="text-sm text-camp-neutral truncate">{entry.hometown}</p>
              {entry.camp_name && <p className="text-xs text-camp-warm truncate">Camp: {entry.camp_name}</p>}
              {entry.favorite_act && <p className="text-xs text-camp-neutral truncate">Fav. Act: {entry.favorite_act}</p>}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, PageHeader } from "@/components/ui";

interface WallEntry {
  label: string;
  nickname: string | null;
  value: number | null;
}

export default function WallOfFame() {
  const [entries, setEntries] = useState<WallEntry[]>([]);

  useEffect(() => {
    api.get<WallEntry[]>("/wall-of-fame").then(setEntries).catch(() => setEntries([]));
  }, []);

  return (
    <div className="pt-2 flex flex-col gap-3">
      <PageHeader title="Wall of Fame" subtitle="Die Rekorde von Camp Helmpflicht" />
      {entries.map((entry, i) => (
        <Card key={i} className="flex items-center justify-between border-camp-primary/30">
          <div>
            <p className="text-xs text-camp-neutral">{entry.label}</p>
            <p className="font-bold text-camp-primary">{entry.nickname ?? "—"}</p>
          </div>
          {entry.value != null && <span className="text-xl font-bold">{entry.value}</span>}
        </Card>
      ))}
    </div>
  );
}

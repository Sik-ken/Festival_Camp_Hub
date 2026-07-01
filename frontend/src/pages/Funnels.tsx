import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, PageHeader } from "@/components/ui";

interface FriendbookUser {
  id: number;
  nickname: string;
}

export default function Funnels() {
  const { user } = useAuth();
  const [users, setUsers] = useState<FriendbookUser[]>([]);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    api.get<FriendbookUser[]>("/friendbook").then(setUsers).catch(() => setUsers([]));
  }, []);

  const canManage = user?.roles.includes("funnel_watcher") || user?.roles.includes("admin");

  async function addFunnel(targetId: number, nickname: string) {
    try {
      await api.post("/funnels", { user_id: targetId });
      setFeedback(`+1 Trichter für ${nickname} eingetragen`);
      setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback("Fehler beim Eintragen");
    }
  }

  async function removeLastFunnel(targetId: number, nickname: string) {
    try {
      const entries = await api.get<{ id: number }[]>(`/funnels/user/${targetId}`);
      if (entries.length === 0) {
        setFeedback(`${nickname} hat noch keine Trichter zum Entfernen`);
        return;
      }
      await api.delete(`/funnels/${entries[0].id}`);
      setFeedback(`Letzter Trichter von ${nickname} entfernt`);
      setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback("Fehler beim Entfernen");
    }
  }

  if (!canManage) {
    return (
      <div className="pt-2">
        <PageHeader title="Trichterliste" subtitle="Nur Trichterwarte und Admins dürfen Trichter eintragen." />
      </div>
    );
  }

  const filtered = users.filter((u) => u.nickname.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="pt-2">
      <PageHeader title="Trichter eintragen" subtitle="0,5L Dosenbier-Trichter = +1" />
      <input
        className="min-h-12 w-full rounded-xl bg-white/10 px-4 text-base mb-4"
        placeholder="Person suchen…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {feedback && <p className="text-camp-primary text-sm mb-3">{feedback}</p>}
      <div className="flex flex-col gap-2">
        {filtered.map((u) => (
          <Card key={u.id} className="flex items-center justify-between">
            <span className="font-semibold">{u.nickname}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => removeLastFunnel(u.id, u.nickname)}
                className="min-h-10 px-3"
              >
                -1
              </Button>
              <Button onClick={() => addFunnel(u.id, u.nickname)} className="min-h-10 px-4">
                +1 🍺
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

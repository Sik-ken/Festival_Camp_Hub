import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, PageHeader } from "@/components/ui";

interface FriendbookUser {
  id: number;
  nickname: string;
}

export default function Funnels() {
  const { user, refresh } = useAuth();
  const [users, setUsers] = useState<FriendbookUser[]>([]);
  const [totals, setTotals] = useState<Record<number, number>>({});
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [nominateQuery, setNominateQuery] = useState("");
  const [nominateFeedback, setNominateFeedback] = useState<string | null>(null);

  const canManage = user?.roles.includes("funnel_watcher") || user?.roles.includes("admin");

  function loadTotals() {
    api.get<Record<number, number>>("/funnels/totals").then(setTotals).catch(() => setTotals({}));
  }

  useEffect(() => {
    api.get<FriendbookUser[]>("/friendbook").then(setUsers).catch(() => setUsers([]));
    if (canManage) loadTotals();
  }, [canManage]);

  async function addFunnel(targetId: number, nickname: string) {
    try {
      await api.post("/funnels", { user_id: targetId });
      setFeedback(`+1 Trichter für ${nickname} eingetragen`);
      setTimeout(() => setFeedback(null), 2500);
      loadTotals();
      if (targetId === user?.id) await refresh();
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
      loadTotals();
    } catch {
      setFeedback("Fehler beim Entfernen");
    }
  }

  async function nominate(targetId: number, nickname: string) {
    try {
      await api.post("/funnels/nominate", { nominee_user_id: targetId });
      setNominateFeedback(`${nickname} wurde angezeigt!`);
      await refresh();
    } catch {
      setNominateFeedback("Fehler beim Anzeigen");
    }
  }

  const filtered = users.filter((u) => u.nickname.toLowerCase().includes(query.toLowerCase()));
  const nominateCandidates = users.filter(
    (u) => u.id !== user?.id && u.nickname.toLowerCase().includes(nominateQuery.toLowerCase())
  );

  return (
    <div className="pt-2 flex flex-col gap-4">
      <PageHeader title="Trichterliste" subtitle="0,5L Dosenbier-Trichter = +1" />

      {user?.pending_nomination && (
        <Card>
          <p className="font-semibold mb-2">Wen zeigst du an?</p>
          <input
            className="min-h-12 w-full rounded-xl bg-white/10 px-4 text-base mb-3"
            placeholder="Person suchen…"
            value={nominateQuery}
            onChange={(e) => setNominateQuery(e.target.value)}
          />
          {nominateFeedback && <p className="text-camp-primary text-sm mb-3">{nominateFeedback}</p>}
          <div className="flex flex-col gap-2">
            {nominateCandidates.map((u) => (
              <div key={u.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                <span className="font-semibold">{u.nickname}</span>
                <Button className="min-h-9 px-4 text-sm" onClick={() => nominate(u.id, u.nickname)}>
                  Anzeigen
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {canManage && (
        <div>
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
                <span className="font-semibold">
                  {u.nickname}{" "}
                  <span className="text-camp-primary">({totals[u.id] ?? 0} 🍺)</span>
                </span>
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
      )}
    </div>
  );
}

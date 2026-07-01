import { useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { Card, PageHeader } from "@/components/ui";

interface PointsEntry {
  rank: number;
  nickname: string;
  points: number;
  level_name: string;
}

interface FunnelEntry {
  rank: number;
  nickname: string;
  funnels: number;
  badge: string | null;
}

export default function Leaderboards() {
  const [tab, setTab] = useState<"points" | "funnels">("points");
  const [points, setPoints] = useState<PointsEntry[]>([]);
  const [funnels, setFunnels] = useState<FunnelEntry[]>([]);

  useEffect(() => {
    api.get<PointsEntry[]>("/leaderboards/points").then(setPoints).catch(() => setPoints([]));
    api.get<FunnelEntry[]>("/funnels/leaderboard").then(setFunnels).catch(() => setFunnels([]));
  }, []);

  return (
    <div className="pt-2">
      <PageHeader title="Ranglisten" />

      <div className="flex gap-2 mb-4">
        <TabButton active={tab === "points"} onClick={() => setTab("points")}>
          Punkte
        </TabButton>
        <TabButton active={tab === "funnels"} onClick={() => setTab("funnels")}>
          Trichter
        </TabButton>
      </div>

      <div className="flex flex-col gap-2">
        {tab === "points"
          ? points.map((p) => (
              <Card key={p.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-camp-warm font-bold w-6">{p.rank}</span>
                  <span className="font-semibold">{p.nickname}</span>
                </div>
                <span className="text-camp-primary font-bold">{p.points} P</span>
              </Card>
            ))
          : funnels.map((f) => (
              <Card key={f.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-camp-warm font-bold w-6">{f.rank}</span>
                  <span className="font-semibold">{f.nickname}</span>
                </div>
                <span className="text-camp-primary font-bold">{f.funnels} 🍺</span>
              </Card>
            ))}
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-h-11 rounded-xl font-semibold ${
        active ? "bg-camp-primary text-camp-bg" : "bg-white/10 text-white"
      }`}
    >
      {children}
    </button>
  );
}

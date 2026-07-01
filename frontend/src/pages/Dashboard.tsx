import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, PageHeader, Tile } from "@/components/ui";

interface ChallengeSummary {
  status: string;
  locked: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);

  useEffect(() => {
    api.get<ChallengeSummary[]>("/challenges").then(setChallenges).catch(() => setChallenges([]));
  }, []);

  const completed = challenges.filter((c) => c.status === "completed").length;
  const open = challenges.filter((c) => !c.locked && c.status !== "completed").length;

  return (
    <div className="pt-2">
      <PageHeader title={`Hey ${user?.nickname ?? ""}!`} subtitle={user?.level_name} />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center">
          <p className="text-2xl font-bold text-camp-primary">{user?.points ?? 0}</p>
          <p className="text-xs text-camp-neutral">Punkte</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-camp-primary">{completed}</p>
          <p className="text-xs text-camp-neutral">Erledigt</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-camp-primary">{open}</p>
          <p className="text-xs text-camp-neutral">Offen</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Tile to="/tasks" label="Challenges" icon="🧱" />
        <Tile to="/leaderboards" label="Ranglisten" icon="🏆" />
        <Tile to="/profile" label="Profil" icon="🪖" />
      </div>
    </div>
  );
}

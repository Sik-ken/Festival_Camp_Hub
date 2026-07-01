import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, PageHeader } from "@/components/ui";

interface ChallengeSummary {
  id: number;
  title: string;
  points: number;
  locked: boolean;
  status: string;
}

export default function Tasks() {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);

  useEffect(() => {
    api.get<ChallengeSummary[]>("/challenges").then(setChallenges).catch(() => setChallenges([]));
  }, []);

  const completed = challenges.filter((c) => c.status === "completed").length;

  return (
    <div className="pt-2 flex flex-col gap-3">
      <PageHeader title="Challenges" subtitle={`${completed} / ${challenges.length} abgeschlossen`} />
      {challenges.map((c) => (
        <Link key={c.id} to={c.locked ? "#" : `/tasks/${c.id}`}>
          <Card
            className={`flex items-center justify-between ${c.locked ? "opacity-50" : ""} ${
              c.status === "completed" ? "border-camp-primary/50" : ""
            }`}
          >
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-xs text-camp-neutral">
                {c.locked ? "🔒 Gesperrt" : c.status === "completed" ? "✅ Erledigt" : "Offen"}
              </p>
            </div>
            <span className="text-camp-primary font-bold">{c.points} P</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}

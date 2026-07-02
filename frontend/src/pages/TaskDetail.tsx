import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, PageHeader } from "@/components/ui";

interface ChallengeDetail {
  id: number;
  title: string;
  description: string;
  points: number;
  locked: boolean;
  status: string;
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ChallengeDetail>(`/challenges/${id}`).then(setChallenge).catch(() => setChallenge(null));
  }, [id]);

  async function handleSubmit() {
    if (!file || !challenge) return;
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append("photo", file);
      await api.post(`/challenges/${challenge.id}/submit`, data);
      await refresh();
      navigate("/tasks");
    } catch {
      setError("Upload fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  if (!challenge) return <p className="pt-4 text-camp-neutral">Lädt…</p>;

  return (
    <div className="pt-2">
      <PageHeader title={challenge.title} subtitle={`${challenge.points} Punkte`} />
      <Card className="flex flex-col gap-4">
        <p>{challenge.description}</p>

        {challenge.status === "completed" ? (
          <p className="text-camp-primary font-semibold">✅ Bereits erledigt</p>
        ) : (
          <>
            <label className="flex flex-col items-center justify-center gap-2 min-h-40 rounded-xl bg-white/10 cursor-pointer overflow-hidden">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">📷</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button disabled={!file || loading} onClick={handleSubmit}>
              {loading ? "Wird hochgeladen…" : "Challenge abschließen"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

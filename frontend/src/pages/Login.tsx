import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button, Card, PageHeader } from "@/components/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [festivalId, setFestivalId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(festivalId, pin);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Anmeldung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-2">
      <img src="/branding/Helmpflicht-Logo-2026-300px.png" alt="Camp Helmpflicht" className="h-28 w-auto mx-auto mb-4" />
      <PageHeader title="Anmelden" subtitle="Mit Benutzername und PIN einloggen." />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-camp-neutral">Benutzername</span>
            <input
              className="min-h-12 rounded-xl bg-white/10 px-4 text-base"
              value={festivalId}
              onChange={(e) => setFestivalId(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-camp-neutral">PIN</span>
            <input
              type="password"
              inputMode="numeric"
              className="min-h-12 rounded-xl bg-white/10 px-4 text-base"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Wird geprüft…" : "Anmelden"}
          </Button>
        </form>
      </Card>
      <p className="text-center text-camp-neutral text-sm mt-4">
        Noch kein Profil?{" "}
        <Link to="/register" className="text-camp-secondary font-semibold">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}

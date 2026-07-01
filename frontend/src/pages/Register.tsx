import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, PageHeader } from "@/components/ui";

export default function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    festival_id: "",
    pin: "",
    nickname: "",
    hometown: "",
    first_name: "",
    camp_name: "",
    crush: "",
    favorite_act: "",
    favorite_color: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!photo) {
      setError("Profilbild ist Pflicht.");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("profile_photo", photo);
      const { access_token } = await api.post<{ access_token: string }>("/auth/register", data);
      setToken(access_token);
      await refresh();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-2 pb-8">
      <PageHeader title="Registrieren" subtitle="Spitzname, Heimatort und Profilbild sind Pflicht." />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Festival-ID" value={form.festival_id} onChange={update("festival_id")} required />
          <Field label="PIN" type="password" inputMode="numeric" value={form.pin} onChange={update("pin")} required />
          <Field label="Spitzname" value={form.nickname} onChange={update("nickname")} required />
          <Field label="Heimatort" value={form.hometown} onChange={update("hometown")} required />

          <label className="flex flex-col gap-1">
            <span className="text-sm text-camp-neutral">Profilbild</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="text-sm"
              required
            />
          </label>

          <p className="text-xs text-camp-neutral pt-2 border-t border-white/10">Optional</p>
          <Field label="Vorname" value={form.first_name} onChange={update("first_name")} />
          <Field label="Camp" value={form.camp_name} onChange={update("camp_name")} />
          <Field label="Mein Festival Crush" value={form.crush} onChange={update("crush")} />
          <Field label="Fav. Act 2025" value={form.favorite_act} onChange={update("favorite_act")} />
          <Field label="Lieblingsfarbe" value={form.favorite_color} onChange={update("favorite_color")} />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Wird angelegt…" : "Profil erstellen"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-camp-neutral">{label}</span>
      <input className="min-h-12 rounded-xl bg-white/10 px-4 text-base" {...props} />
    </label>
  );
}

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, PageHeader } from "@/components/ui";

const EDITABLE_FIELDS = [
  { key: "nickname", label: "Spitzname (Anzeigename)" },
  { key: "hometown", label: "Heimatort" },
  { key: "first_name", label: "Vorname" },
  { key: "camp_name", label: "Camp" },
  { key: "crush", label: "Mein Festival Crush" },
  { key: "favorite_act", label: "Fav. Act 2025" },
  { key: "favorite_color", label: "Lieblingsfarbe" },
] as const;

type EditableField = (typeof EDITABLE_FIELDS)[number]["key"];
type FormState = Record<EditableField, string>;

export default function Profile() {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="pt-2">
        <PageHeader title="Profil" subtitle="Du bist noch nicht angemeldet." />
        <Button onClick={() => navigate("/login")}>Zum Login</Button>
      </div>
    );
  }

  function startEditing() {
    setForm({
      nickname: user!.nickname,
      hometown: user!.hometown,
      first_name: user!.first_name ?? "",
      camp_name: user!.camp_name ?? "",
      crush: user!.crush ?? "",
      favorite_act: user!.favorite_act ?? "",
      favorite_color: user!.favorite_color ?? "",
    });
    setPhoto(null);
    setError(null);
    setEditing(true);
  }

  function update(field: EditableField) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => (f ? { ...f, [field]: e.target.value } : f));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await api.patch("/auth/me", form);
      if (photo) {
        const data = new FormData();
        data.append("profile_photo", photo);
        await api.post("/auth/me/photo", data);
      }
      await refresh();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  if (editing && form) {
    return (
      <div className="pt-2 pb-8">
        <PageHeader title="Profil bearbeiten" />
        <Card>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <label className="flex flex-col items-center gap-2">
              {photo || user.profile_photo_path ? (
                <img
                  src={photo ? URL.createObjectURL(photo) : mediaUrl(user.profile_photo_path)}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10" />
              )}
              <span className="text-sm text-camp-secondary font-semibold">Neues Foto wählen</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </label>

            {EDITABLE_FIELDS.map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-sm text-camp-neutral">{label}</span>
                <input
                  className="min-h-12 rounded-xl bg-white/10 px-4 text-base"
                  value={form[key]}
                  onChange={update(key)}
                  required={key === "nickname" || key === "hometown"}
                />
              </label>
            ))}

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Speichert…" : "Speichern"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <PageHeader title="Profil" />
      <Card className="flex flex-col items-center gap-3 text-center">
        {user.profile_photo_path && (
          <img src={mediaUrl(user.profile_photo_path)} alt="" className="w-24 h-24 rounded-full object-cover" />
        )}
        <p className="text-xl font-bold text-camp-primary">{user.nickname}</p>
        <p className="text-camp-neutral">{user.hometown}</p>
        <p className="text-sm text-camp-warm">{user.level_name} · {user.points} Punkte · {user.funnels_total} 🍺</p>
        {user.roles.length > 0 && (
          <p className="text-xs text-camp-secondary">Rollen: {user.roles.join(", ")}</p>
        )}

        <Button variant="secondary" onClick={startEditing} className="min-h-10 px-4 text-sm">
          Profil bearbeiten
        </Button>

        <div className="flex gap-2 flex-wrap justify-center">
          {(user.roles.includes("admin") || user.roles.includes("funnel_watcher")) && (
            <Link to="/funnels">
              <Button variant="secondary" className="min-h-10 px-4 text-sm">
                Trichter eintragen
              </Button>
            </Link>
          )}
          {user.roles.includes("admin") && (
            <Link to="/admin">
              <Button variant="secondary" className="min-h-10 px-4 text-sm">
                Admin-Bereich
              </Button>
            </Link>
          )}
        </div>

        <Button variant="ghost" onClick={logout} className="mt-2">
          Abmelden
        </Button>
      </Card>
    </div>
  );
}

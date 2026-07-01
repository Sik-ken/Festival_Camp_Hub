import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Card, PageHeader } from "@/components/ui";

interface Stats {
  participants: number;
  photos: number;
  challenges_completed: number;
  funnels_total: number;
}

interface AdminUser {
  id: number;
  festival_id: string;
  nickname: string;
  hometown: string;
  points: number;
  level_name: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
}

const MANAGEABLE_ROLES = ["funnel_watcher", "admin"];
const ROLE_LABELS: Record<string, string> = {
  funnel_watcher: "Trichterwart",
  admin: "Admin",
};

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  function loadStats() {
    api.get<Stats>("/stats").then(setStats).catch(() => setStats(null));
  }

  function loadUsers() {
    api.get<AdminUser[]>("/admin/users").then(setUsers).catch(() => setUsers([]));
  }

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  async function triggerBackup() {
    const res = await api.post<{ backup_path: string }>("/admin/backups");
    setBackupMessage(`Backup erstellt: ${res.backup_path}`);
  }

  return (
    <div className="pt-2 flex flex-col gap-4 pb-8">
      <PageHeader title="Admin" subtitle="Verwaltung von Camp Helmpflicht" />

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-camp-primary">{stats.participants}</p>
            <p className="text-xs text-camp-neutral">Nutzer</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-camp-primary">{stats.photos}</p>
            <p className="text-xs text-camp-neutral">Fotos</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-camp-primary">{stats.challenges_completed}</p>
            <p className="text-xs text-camp-neutral">Challenges erledigt</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-camp-primary">{stats.funnels_total}</p>
            <p className="text-xs text-camp-neutral">Trichter gesamt</p>
          </Card>
        </div>
      )}

      <Card>
        <p className="font-semibold mb-2">Backup</p>
        <Button onClick={triggerBackup}>Backup jetzt erstellen</Button>
        {backupMessage && <p className="text-sm text-camp-primary mt-2">{backupMessage}</p>}
      </Card>

      <Card>
        <p className="font-semibold mb-3">Nutzerverwaltung</p>
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <AdminUserRow key={u.id} user={u} onChanged={loadUsers} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminUserRow({ user, onChanged }: { user: AdminUser; onChanged: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [pointsDelta, setPointsDelta] = useState("");
  const [newPin, setNewPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function toggleRole(roleName: string) {
    if (user.roles.includes(roleName)) {
      await api.delete(`/admin/users/${user.id}/roles/${roleName}`);
    } else {
      await api.post(`/admin/users/${user.id}/roles`, { role_name: roleName });
    }
    onChanged();
  }

  async function toggleActive() {
    await api.patch(`/admin/users/${user.id}`, { is_active: !user.is_active });
    onChanged();
  }

  async function applyPointsDelta() {
    const delta = parseInt(pointsDelta, 10);
    if (Number.isNaN(delta)) return;
    await api.post(`/admin/users/${user.id}/adjust-points`, { delta });
    setPointsDelta("");
    setMessage(`Punkte angepasst (${delta > 0 ? "+" : ""}${delta})`);
    onChanged();
  }

  async function applyPinReset() {
    if (newPin.length < 4) {
      setMessage("PIN muss mindestens 4 Zeichen haben");
      return;
    }
    await api.post(`/admin/users/${user.id}/reset-pin`, { new_pin: newPin });
    setNewPin("");
    setMessage("PIN zurückgesetzt");
  }

  return (
    <div className={`border-b border-white/10 pb-3 ${!user.is_active ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold truncate">
            {user.nickname} {!user.is_active && <span className="text-xs text-red-400">(deaktiviert)</span>}
          </p>
          <p className="text-xs text-camp-neutral truncate">
            {user.festival_id} · {user.points} P · {user.level_name}
          </p>
          {user.roles.length > 0 && (
            <p className="text-xs text-camp-secondary mt-0.5">
              {user.roles.map((r) => ROLE_LABELS[r] ?? r).join(", ")}
            </p>
          )}
        </div>
        <Button variant="ghost" className="min-h-9 px-3 text-xs shrink-0" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Schließen" : "Verwalten"}
        </Button>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-3 bg-white/5 rounded-xl p-3">
          <div>
            <p className="text-xs text-camp-neutral mb-1">Rollen</p>
            <div className="flex gap-2 flex-wrap">
              {MANAGEABLE_ROLES.map((role) => (
                <Button
                  key={role}
                  variant={user.roles.includes(role) ? "secondary" : "ghost"}
                  className="min-h-9 px-3 text-xs"
                  onClick={() => toggleRole(role)}
                >
                  {user.roles.includes(role) ? `✓ ${ROLE_LABELS[role]}` : `+ ${ROLE_LABELS[role]}`}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-camp-neutral mb-1">Challenge-Punkte korrigieren</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="z.B. -20 oder 10"
                className="min-h-10 rounded-lg bg-white/10 px-3 text-sm flex-1"
                value={pointsDelta}
                onChange={(e) => setPointsDelta(e.target.value)}
              />
              <Button className="min-h-10 px-4 text-sm" onClick={applyPointsDelta}>
                Anwenden
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-camp-neutral mb-1">PIN zurücksetzen (mind. 4 Zeichen)</p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Neue PIN"
                className="min-h-10 rounded-lg bg-white/10 px-3 text-sm flex-1"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
              <Button className="min-h-10 px-4 text-sm" onClick={applyPinReset}>
                Setzen
              </Button>
            </div>
          </div>

          {message && <p className="text-xs text-camp-primary">{message}</p>}

          <Button variant="ghost" className="min-h-9 text-xs text-red-400" onClick={toggleActive}>
            {user.is_active ? "Nutzer deaktivieren (löschen)" : "Nutzer reaktivieren"}
          </Button>
        </div>
      )}
    </div>
  );
}

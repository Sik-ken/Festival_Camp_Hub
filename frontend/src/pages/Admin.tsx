import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button, Card, PageHeader } from "@/components/ui";

interface Stats {
  users: number;
  photos: number;
  challenges_completed: number;
  funnels_total: number;
}

interface AdminUser {
  id: number;
  festival_id: string;
  nickname: string;
  points: number;
  is_active: boolean;
}

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  function loadStats() {
    api.get<Stats>("/admin/stats").then(setStats).catch(() => setStats(null));
  }

  useEffect(() => {
    loadStats();
    api.get<AdminUser[]>("/admin/users").then(setUsers).catch(() => setUsers([]));
  }, []);

  async function assignRole(userId: number, roleName: string) {
    await api.post(`/admin/users/${userId}/roles`, { role_name: roleName });
  }

  async function triggerBackup() {
    const res = await api.post<{ backup_path: string }>("/admin/backups");
    setBackupMessage(`Backup erstellt: ${res.backup_path}`);
  }

  return (
    <div className="pt-2 flex flex-col gap-4">
      <PageHeader title="Admin" subtitle="Verwaltung von Camp Helmpflicht" />

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-camp-primary">{stats.users}</p>
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
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <p className="font-semibold">{u.nickname}</p>
                <p className="text-xs text-camp-neutral">
                  {u.festival_id} · {u.points} P
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="min-h-9 px-3 text-xs" onClick={() => assignRole(u.id, "funnel_watcher")}>
                  + Trichterwart
                </Button>
                <Button variant="ghost" className="min-h-9 px-3 text-xs" onClick={() => assignRole(u.id, "admin")}>
                  + Admin
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

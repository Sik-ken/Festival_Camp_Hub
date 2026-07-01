import { Link, useNavigate } from "react-router-dom";
import { mediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, PageHeader } from "@/components/ui";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="pt-2">
        <PageHeader title="Profil" subtitle="Du bist noch nicht angemeldet." />
        <Button onClick={() => navigate("/login")}>Zum Login</Button>
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
        <p className="text-sm text-camp-warm">{user.level_name} · {user.points} Punkte</p>
        {user.roles.length > 0 && (
          <p className="text-xs text-camp-secondary">Rollen: {user.roles.join(", ")}</p>
        )}

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

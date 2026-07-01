import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/photo-booth", label: "Fotobox", icon: "📸" },
  { to: "/tasks", label: "Challenges", icon: "🧱" },
  { to: "/gallery", label: "Galerie", icon: "🖼️" },
  { to: "/profile", label: "Profil", icon: "🪖" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-camp-bg text-white">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/branding/Helmpflicht-Logo-2026-300px.png" alt="Camp Helmpflicht" className="h-10 w-auto" />
          <span className="text-lg font-extrabold tracking-tight text-camp-primary">Helmpflicht Hub</span>
        </Link>
        {user ? (
          <Link to="/profile" className="text-sm text-camp-secondary font-semibold">
            {user.nickname} · {user.points} P
          </Link>
        ) : (
          <Link to="/login" className="text-sm text-camp-secondary font-semibold">
            Anmelden
          </Link>
        )}
      </header>

      <main className="flex-1 px-4 pb-24 max-w-2xl w-full mx-auto">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-camp-bg/95 backdrop-blur border-t border-white/10">
        <div className="max-w-2xl mx-auto grid grid-cols-5">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-1 py-2 min-h-14 text-xs font-semibold ${
                  active ? "text-camp-primary" : "text-camp-neutral"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

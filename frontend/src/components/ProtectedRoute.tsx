import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function ProtectedRoute({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) return <p className="pt-8 text-center text-camp-neutral">Lädt…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && !user.roles.includes(requireRole)) {
    return <p className="pt-8 text-center text-camp-neutral">Keine Berechtigung.</p>;
  }
  return <>{children}</>;
}

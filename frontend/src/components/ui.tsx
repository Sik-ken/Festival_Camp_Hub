import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const base = "min-h-12 px-5 rounded-xl font-semibold text-base transition active:scale-[0.98] disabled:opacity-50";
  const styles = {
    primary: "bg-camp-primary text-camp-bg",
    secondary: "bg-camp-secondary text-camp-bg",
    ghost: "bg-white/10 text-white",
  }[variant];
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Tile({ label, to, icon }: { label: string; to: string; icon: ReactNode }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-5 min-h-28 hover:bg-white/10 active:scale-[0.98] transition"
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-sm font-semibold text-center">{label}</div>
    </Link>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-camp-primary">{title}</h1>
      {subtitle && <p className="text-camp-neutral text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useApi } from "@/hooks/useApi";
import { Team } from "@/types";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const LAST_TEAM_KEY = "bst:lastTeamId";

// Heroicons (outline) paths, kept inline so the sidebar has no icon dependency.
const ICONS = {
  teams: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198v.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  overview: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  stats: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  spray: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0-3.75a.75.75 0 100-1.5.75.75 0 000 1.5z",
  search: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  help: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
  admin: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  signOut: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
} as const;

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
    </svg>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { appUser, logout } = useAuth();
  const { apiFetch } = useApi();
  const t = useTranslations("nav");
  const [teams, setTeams] = useState<Team[]>([]);
  const [rememberedTeamId, setRememberedTeamId] = useState<string | null>(() => {
    try {
      return typeof window === "undefined" ? null : localStorage.getItem(LAST_TEAM_KEY);
    } catch {
      return null; // storage unavailable (private mode) — fall back to the first team
    }
  });

  const pathTeamId = pathname.match(/^\/teams\/([^/]+)/)?.[1] ?? null;

  // Remember the team being viewed so game pages (which have no team in the
  // URL) still show that team's links.
  if (pathTeamId && pathTeamId !== rememberedTeamId) {
    setRememberedTeamId(pathTeamId);
  }

  useEffect(() => {
    apiFetch("/api/teams")
      .then(setTeams)
      .catch(() => {});
  }, [apiFetch]);

  useEffect(() => {
    if (!pathTeamId) return;
    try {
      localStorage.setItem(LAST_TEAM_KEY, pathTeamId);
    } catch {
      // ignore
    }
  }, [pathTeamId]);

  const currentTeam =
    teams.find((tm) => tm.id === (pathTeamId ?? rememberedTeamId)) ?? teams[0] ?? null;

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const linkClass = (active: boolean) =>
    clsx(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
        : "text-gray-600 hover:bg-black/[0.04] hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
    );

  const switchTeam = (teamId: string) => {
    // Stay on the same kind of page (stats, spray chart) when switching teams.
    const sub = pathTeamId ? pathname.replace(/^\/teams\/[^/]+/, "") : "";
    router.push(`/teams/${teamId}${sub}`);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-black/[0.06] bg-[#F1EFEA] lg:flex dark:border-white/10 dark:bg-gray-900">
      {/* The logo opens the splash page; its back arrow returns here via ?from. */}
      <Link href={`/?from=${encodeURIComponent(pathname)}`} className="flex items-center gap-2.5 px-5 pb-4 pt-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 4.5c1.5 2 1.5 4.5 0 7.5s-1.5 5.5 0 7.5M16 4.5c-1.5 2-1.5 4.5 0 7.5s1.5 5.5 0 7.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-display text-[15px] font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
          Baseball Stats Tracker
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          <Link href="/dashboard" className={linkClass(isActive("/dashboard"))}>
            <Icon name="teams" />
            {t("myTeams")}
          </Link>
        </div>

        {currentTeam && (
          <div>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {t("team")}
            </p>
            {teams.length > 1 ? (
              <select
                aria-label={t("team")}
                value={currentTeam.id}
                onChange={(e) => switchTeam(e.target.value)}
                className="mb-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm dark:border-white/10 dark:bg-gray-800 dark:text-white"
              >
                {teams.map((tm) => (
                  <option key={tm.id} value={tm.id}>{tm.name}</option>
                ))}
              </select>
            ) : (
              <p className="mb-2 truncate px-3 text-sm font-semibold text-gray-900 dark:text-white">{currentTeam.name}</p>
            )}
            <div className="space-y-0.5">
              <Link href={`/teams/${currentTeam.id}`} className={linkClass(isActive(`/teams/${currentTeam.id}`, true))}>
                <Icon name="overview" />
                {t("overview")}
              </Link>
              <Link href={`/teams/${currentTeam.id}/stats`} className={linkClass(isActive(`/teams/${currentTeam.id}/stats`))}>
                <Icon name="stats" />
                {t("seasonStats")}
              </Link>
              <Link href={`/teams/${currentTeam.id}/spray-chart`} className={linkClass(isActive(`/teams/${currentTeam.id}/spray-chart`))}>
                <Icon name="spray" />
                {t("sprayCharts")}
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          <Link href="/stats/search" className={linkClass(isActive("/stats/search"))}>
            <Icon name="search" />
            {t("statsSearch")}
          </Link>
          <Link href="/instructions" className={linkClass(isActive("/instructions"))}>
            <Icon name="help" />
            {t("instructions")}
          </Link>
          {appUser?.isAdmin && (
            <Link href="/admin" className={linkClass(isActive("/admin"))}>
              <Icon name="admin" />
              {t("admin")}
            </Link>
          )}
        </div>
      </nav>

      <div className="space-y-2 border-t border-black/[0.06] px-3 py-3 dark:border-white/10">
        <div className="flex items-center gap-2 px-1">
          <LanguageSwitcher className="min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300" />
          <ThemeToggle />
        </div>
        <button onClick={logout} className={clsx(linkClass(false), "w-full")}>
          <Icon name="signOut" />
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}

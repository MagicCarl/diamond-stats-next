"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

type AnalyticsT = (key: string, values?: Record<string, string | number>) => string;

interface AnalyticsData {
  overview: {
    totalUsers: number;
    paidUsers: number;
    activeUsers: number;
    totalGames: number;
    recentLogins: number;
  };
  recentEvents: Array<{
    id: string;
    eventType: string;
    createdAt: string;
    metadata: Record<string, unknown> | null;
    user: { email: string; displayName: string | null } | null;
  }>;
  dailyLogins: Array<{ date: string; count: number }>;
  dailyGames: Array<{ date: string; count: number }>;
  userGrowth: Array<{ week: string; count: number }>;
}

interface GARow {
  dimensionValues: Array<{ value: string }>;
  metricValues: Array<{ value: string }>;
}

interface GAData {
  pageViews: GARow[];
  topPages: GARow[];
  trafficSources: GARow[];
  countries: GARow[];
}

function formatTimeAgo(dateStr: string, t: AnalyticsT): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("daysAgo", { count: days });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatWeek(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// GA4 "date" dimension comes back as YYYYMMDD
function parseGADate(raw: string): Date {
  return new Date(+raw.slice(0, 4), +raw.slice(4, 6) - 1, +raw.slice(6, 8));
}

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return mins === 0 ? `${secs}s` : `${mins}m ${secs}s`;
}

// Monday of the week containing `date`
function isoWeekStart(date: Date): Date {
  const d = new Date(date);
  const offset = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

const EVENT_COLORS: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  GAME_CREATED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PAYMENT_TOGGLED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  TEAM_CREATED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  SIGNUP: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export default function AnalyticsTab() {
  const { apiFetch } = useApi();
  const t = useTranslations("admin.analytics");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [gaData, setGaData] = useState<GAData | null>(null);
  const [gaError, setGaError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/admin/analytics").then(setData),
      apiFetch("/api/admin/analytics/ga")
        .then(setGaData)
        .catch(() => setGaError(true)),
    ]).finally(() => setLoading(false));
  }, [apiFetch]);

  if (loading || !data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const maxLoginCount = Math.max(...data.dailyLogins.map((d) => d.count), 1);
  const maxGameCount = Math.max(...data.dailyGames.map((d) => d.count), 1);
  const maxGrowthCount = Math.max(...data.userGrowth.map((w) => w.count), 1);

  // Compute GA totals
  const gaTotals = gaData
    ? {
        pageViews: gaData.pageViews.reduce(
          (sum, r) => sum + parseInt(r.metricValues[0]?.value || "0"),
          0
        ),
        sessions: gaData.pageViews.reduce(
          (sum, r) => sum + parseInt(r.metricValues[1]?.value || "0"),
          0
        ),
        activeUsers: gaData.pageViews.reduce(
          (sum, r) => sum + parseInt(r.metricValues[2]?.value || "0"),
          0
        ),
      }
    : null;

  // Per-day visitor breakdown derived from the GA "date" report.
  // metricValues = [screenPageViews, sessions, activeUsers, averageSessionDuration]
  const dailyVisitors = gaData
    ? gaData.pageViews.map((r) => ({
        date: parseGADate(r.dimensionValues[0]?.value || ""),
        visitors: parseInt(r.metricValues[2]?.value || "0"),
        sessions: parseInt(r.metricValues[1]?.value || "0"),
        avgDuration: parseFloat(r.metricValues[3]?.value || "0"),
      }))
    : [];

  // Session-weighted average so longer-traffic days count proportionally.
  const totalSessions = dailyVisitors.reduce((s, d) => s + d.sessions, 0);
  const avgSessionDuration =
    totalSessions > 0
      ? dailyVisitors.reduce((s, d) => s + d.avgDuration * d.sessions, 0) /
        totalSessions
      : 0;

  // Roll daily visitors up into ISO weeks (Monday start).
  const weeklyMap = new Map<number, { week: Date; visitors: number }>();
  for (const d of dailyVisitors) {
    const wk = isoWeekStart(d.date);
    const key = wk.getTime();
    const existing = weeklyMap.get(key);
    if (existing) existing.visitors += d.visitors;
    else weeklyMap.set(key, { week: wk, visitors: d.visitors });
  }
  const weeklyVisitors = [...weeklyMap.values()].sort(
    (a, b) => a.week.getTime() - b.week.getTime()
  );

  const maxDailyVisitors = Math.max(...dailyVisitors.map((d) => d.visitors), 1);
  const maxWeeklyVisitors = Math.max(
    ...weeklyVisitors.map((w) => w.visitors),
    1
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalUsers")}</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("paidUsers")}</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.paidUsers}</p>
          <p className="text-xs text-gray-400">
            {data.overview.totalUsers > 0
              ? `${Math.round((data.overview.paidUsers / data.overview.totalUsers) * 100)}%`
              : "0%"}{" "}
            {t("conversionLabel")}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("activeUsers7d")}</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.activeUsers}</p>
          <p className="text-xs text-gray-400">
            {t("loginsThisWeek", { count: data.overview.recentLogins })}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("totalGames")}</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.totalGames}</p>
        </Card>
      </div>

      {/* Daily Activity Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("dailyLogins")}
          </h3>
          {data.dailyLogins.length > 0 ? (
            <div className="flex items-end gap-0.5" style={{ height: "120px" }}>
              {data.dailyLogins.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex-1 rounded-t bg-blue-400 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
                  style={{
                    height: `${(day.count / maxLoginCount) * 100}%`,
                    minHeight: day.count > 0 ? "4px" : "0",
                  }}
                  title={t("tooltipLogins", { date: formatDate(day.date), count: day.count })}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">{t("noLoginData")}</p>
          )}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("gamesCreated")}
          </h3>
          {data.dailyGames.length > 0 ? (
            <div className="flex items-end gap-0.5" style={{ height: "120px" }}>
              {data.dailyGames.map((day) => (
                <div
                  key={day.date}
                  className="group relative flex-1 rounded-t bg-green-400 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-400 transition-colors"
                  style={{
                    height: `${(day.count / maxGameCount) * 100}%`,
                    minHeight: day.count > 0 ? "4px" : "0",
                  }}
                  title={t("tooltipGames", { date: formatDate(day.date), count: day.count })}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">{t("noGameData")}</p>
          )}
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {t("userSignups")}
        </h3>
        {data.userGrowth.length > 0 ? (
          <div className="space-y-2">
            {data.userGrowth.map((week) => (
              <div key={week.week} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-gray-500">
                  {formatWeek(week.week)}
                </span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded bg-blue-500 dark:bg-blue-400 transition-all"
                    style={{
                      width: `${(week.count / maxGrowthCount) * 100}%`,
                      minWidth: week.count > 0 ? "8px" : "0",
                    }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-gray-500">
                  {week.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">{t("noSignupData")}</p>
        )}
      </Card>

      {/* Google Analytics Data */}
      {!gaError && gaData && gaTotals && (
        <>
          <h2 className="pt-2 text-lg font-semibold">{t("visitorsSection")}</h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("visitors30d")}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {gaTotals.activeUsers.toLocaleString()}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("sessions30d")}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {gaTotals.sessions.toLocaleString()}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("pageViews30d")}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {gaTotals.pageViews.toLocaleString()}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("avgTimeOnSite")}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {formatDuration(avgSessionDuration)}
              </p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Daily Visitors */}
            <Card>
              <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("dailyVisitors")}
              </h3>
              {dailyVisitors.length > 0 ? (
                <div className="flex items-end gap-0.5" style={{ height: "120px" }}>
                  {dailyVisitors.map((day) => (
                    <div
                      key={day.date.getTime()}
                      className="group relative flex-1 rounded-t bg-indigo-400 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
                      style={{
                        height: `${(day.visitors / maxDailyVisitors) * 100}%`,
                        minHeight: day.visitors > 0 ? "4px" : "0",
                      }}
                      title={t("tooltipVisitors", {
                        date: shortDate(day.date),
                        count: day.visitors,
                      })}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">{t("noVisitorData")}</p>
              )}
            </Card>

            {/* Weekly Visitors */}
            <Card>
              <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("weeklyVisitors")}
              </h3>
              {weeklyVisitors.length > 0 ? (
                <div className="space-y-2">
                  {weeklyVisitors.map((w) => (
                    <div key={w.week.getTime()} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs text-gray-500">
                        {shortDate(w.week)}
                      </span>
                      <div className="flex-1">
                        <div
                          className="h-6 rounded bg-indigo-500 dark:bg-indigo-400 transition-all"
                          style={{
                            width: `${(w.visitors / maxWeeklyVisitors) * 100}%`,
                            minWidth: w.visitors > 0 ? "8px" : "0",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-gray-500">
                        {w.visitors}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">{t("noVisitorData")}</p>
              )}
              <p className="mt-3 text-xs text-gray-400">
                {t("weeklyVisitorsCaption")}
              </p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Top Pages */}
            <Card>
              <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("topPages")}
              </h3>
              <div className="space-y-2">
                {gaData.topPages.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm dark:border-gray-800 last:border-0"
                  >
                    <span className="truncate text-gray-700 dark:text-gray-300">
                      {row.dimensionValues[0]?.value}
                    </span>
                    <span className="ml-2 shrink-0 text-gray-500">
                      {parseInt(row.metricValues[0]?.value || "0").toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("trafficSources")}
              </h3>
              <div className="space-y-2">
                {gaData.trafficSources.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm dark:border-gray-800 last:border-0"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {row.dimensionValues[0]?.value}
                    </span>
                    <span className="ml-2 text-gray-500">
                      {parseInt(row.metricValues[0]?.value || "0").toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Countries */}
            <Card>
              <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("topCountries")}
              </h3>
              <div className="space-y-2">
                {gaData.countries.length === 0 ? (
                  <p className="text-sm text-gray-400">{t("noCountryData")}</p>
                ) : (
                  gaData.countries.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm dark:border-gray-800 last:border-0"
                    >
                      <span className="truncate text-gray-700 dark:text-gray-300">
                        {row.dimensionValues[0]?.value || t("countryUnknown")}
                      </span>
                      <span className="ml-2 shrink-0 text-gray-500">
                        {parseInt(row.metricValues[0]?.value || "0").toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      {gaError && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.rich("gaUnavailable", {
              code: (c) => <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">{c}</code>,
            })}
          </p>
        </Card>
      )}

      {/* Recent Activity Log */}
      <Card>
        <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {t("recentActivity")}
        </h3>
        {data.recentEvents.length > 0 ? (
          <div className="space-y-1">
            {data.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between border-b border-gray-100 py-2 text-sm dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                      EVENT_COLORS[event.eventType] ||
                      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {event.eventType}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {event.user?.displayName || event.user?.email || t("anonymous")}
                  </span>
                  {typeof event.metadata?.ref === "string" && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      ref: {event.metadata.ref}
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {formatTimeAgo(event.createdAt, t)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">{t("noEvents")}</p>
        )}
      </Card>
    </div>
  );
}

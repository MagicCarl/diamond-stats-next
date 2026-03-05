"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

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
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatWeek(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const EVENT_COLORS: Record<string, string> = {
  LOGIN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  GAME_CREATED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PAYMENT_TOGGLED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAGE_VIEW: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  TEAM_CREATED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  SIGNUP: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export default function AnalyticsTab() {
  const { apiFetch } = useApi();
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

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Paid Users</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.paidUsers}</p>
          <p className="text-xs text-gray-400">
            {data.overview.totalUsers > 0
              ? `${Math.round((data.overview.paidUsers / data.overview.totalUsers) * 100)}%`
              : "0%"}{" "}
            conversion
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Users (7d)</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.activeUsers}</p>
          <p className="text-xs text-gray-400">
            {data.overview.recentLogins} logins this week
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Games</p>
          <p className="mt-1 text-3xl font-bold">{data.overview.totalGames}</p>
        </Card>
      </div>

      {/* Daily Activity Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            Daily Logins (30 days)
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
                  title={`${formatDate(day.date)}: ${day.count} logins`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No login data yet</p>
          )}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            Games Created (30 days)
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
                  title={`${formatDate(day.date)}: ${day.count} games`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No game data yet</p>
          )}
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          User Signups (Last 12 Weeks)
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
          <p className="text-sm text-gray-400">No signup data yet</p>
        )}
      </Card>

      {/* Google Analytics Data */}
      {!gaError && gaData && gaTotals && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page Views (30d)
              </p>
              <p className="mt-1 text-3xl font-bold">
                {gaTotals.pageViews.toLocaleString()}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sessions (30d)
              </p>
              <p className="mt-1 text-3xl font-bold">
                {gaTotals.sessions.toLocaleString()}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                GA Active Users (30d)
              </p>
              <p className="mt-1 text-3xl font-bold">
                {gaTotals.activeUsers.toLocaleString()}
              </p>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Pages */}
            <Card>
              <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                Top Pages
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
                Traffic Sources
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
          </div>
        </>
      )}

      {gaError && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Google Analytics data not available. Set <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">GA4_PROPERTY_ID</code> and grant your Firebase service account Viewer access in GA4 to enable.
          </p>
        </Card>
      )}

      {/* Recent Activity Log */}
      <Card>
        <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Recent Activity
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
                    {event.user?.displayName || event.user?.email || "Anonymous"}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {formatTimeAgo(event.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No events tracked yet</p>
        )}
      </Card>
    </div>
  );
}

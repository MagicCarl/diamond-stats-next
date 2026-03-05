import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface DailyCount {
  date: Date;
  count: number;
}

interface WeeklyCount {
  week: Date;
  count: number;
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twelveWeeksAgo = new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    paidUsers,
    totalGames,
    recentLogins,
    recentEvents,
    dailyLogins,
    dailyGames,
    userGrowth,
    activeUsersResult,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isPaid: true } }),
    prisma.game.count(),
    prisma.analyticsEvent.count({
      where: { eventType: "LOGIN", createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.analyticsEvent.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true, displayName: true } } },
    }),
    prisma.$queryRaw<DailyCount[]>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM analytics_events
      WHERE event_type = 'LOGIN' AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date
    `,
    prisma.$queryRaw<DailyCount[]>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM games
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date
    `,
    prisma.$queryRaw<WeeklyCount[]>`
      SELECT DATE_TRUNC('week', created_at) as week, COUNT(*)::int as count
      FROM users
      WHERE created_at >= ${twelveWeeksAgo}
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week
    `,
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: {
        eventType: "LOGIN",
        createdAt: { gte: sevenDaysAgo },
        userId: { not: null },
      },
    }),
  ]);

  return NextResponse.json({
    overview: {
      totalUsers,
      paidUsers,
      activeUsers: activeUsersResult.length,
      totalGames,
      recentLogins,
    },
    recentEvents,
    dailyLogins,
    dailyGames,
    userGrowth,
  });
}

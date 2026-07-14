import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    // Rule: nobody appears on the Users page without BOTH a name and an email.
    // This hides nameless/soft-deleted junk (e.g. bot signups) from the list.
    where: {
      AND: [
        { displayName: { not: null } },
        { displayName: { not: "" } },
        { email: { not: "" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      isPaid: true,
      isAdmin: true,
      deletedAt: true,
      createdAt: true,
      _count: { select: { organizations: true } },
    },
  });

  // Per-user login activity, derived from LOGIN analytics events. Note: a LOGIN
  // event fires whenever Firebase resolves an authenticated session (including
  // page reloads / token refreshes), so this is closer to "app opens" than to
  // distinct sign-ins. One grouped query covers every user.
  const loginStats = await prisma.analyticsEvent.groupBy({
    by: ["userId"],
    where: { eventType: "LOGIN", userId: { not: null } },
    _count: { _all: true },
    _max: { createdAt: true },
  });
  const loginsByUser = new Map(
    loginStats.map((s) => [
      s.userId as string,
      { count: s._count._all, lastLoginAt: s._max.createdAt },
    ]),
  );

  const usersWithLogins = users.map((u) => {
    const stats = loginsByUser.get(u.id);
    // A user row is only ever created during a verified, authenticated sign-in,
    // so every user here has logged in at least once — their signup IS login #1.
    // Floor the count at 1 and fall back to the account-creation time when there
    // is no explicit LOGIN telemetry (e.g. accounts predating LOGIN tracking, or
    // a fire-and-forget LOGIN event that never landed).
    return {
      ...u,
      loginCount: Math.max(stats?.count ?? 0, 1),
      lastLoginAt: stats?.lastLoginAt ?? u.createdAt,
    };
  });

  return NextResponse.json(usersWithLogins);
}

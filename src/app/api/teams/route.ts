import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();


  const teams = await prisma.team.findMany({
    where: {
      organization: { ownerId: user.id },
    },
    include: {
      _count: { select: { players: { where: { isActive: true } }, games: true } },
      seasons: { where: { isActive: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  // Also count games played AGAINST each team (by opponent name match)
  const enriched = await Promise.all(
    teams.map(async (team) => {
      const gamesAsOpponent = await prisma.game.count({
        where: {
          teamId: { not: team.id },
          team: { organization: { ownerId: user.id } },
          opponentName: { equals: team.name, mode: "insensitive" },
        },
      });
      return {
        ...team,
        _count: {
          ...team._count,
          games: team._count.games + gamesAsOpponent,
        },
      };
    })
  );

  return NextResponse.json(enriched, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { name, sport = "baseball", level = "little_league" } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  // Find or create organization for this user
  let org = await prisma.organization.findFirst({
    where: { ownerId: user.id },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: `${user.displayName || user.email}'s Organization`,
        ownerId: user.id,
      },
    });
  }

  const team = await prisma.team.create({
    data: {
      name: name.trim(),
      sport,
      level,
      organizationId: org.id,
    },
    include: {
      _count: { select: { players: { where: { isActive: true } }, games: true } },
    },
  });

  return NextResponse.json(team, { status: 201 });
}

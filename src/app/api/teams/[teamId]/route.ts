import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organization: { ownerId: user.id },
    },
    include: {
      players: { where: { isActive: true }, orderBy: { jerseyNumber: "asc" } },
      seasons: { orderBy: { createdAt: "desc" } },
      games: { orderBy: { gameDate: "desc" }, take: 20 },
      _count: { select: { players: { where: { isActive: true } }, games: true } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Also find games where this team appears as the opponent
  const gamesAsOpponent = await prisma.game.findMany({
    where: {
      teamId: { not: teamId },
      team: { organization: { ownerId: user.id } },
      opponentName: { equals: team.name, mode: "insensitive" },
    },
    include: {
      team: { select: { name: true } },
    },
    orderBy: { gameDate: "desc" },
    take: 20,
  });

  // Flip perspective for opponent games: swap scores, flip home/away
  const flippedGames = gamesAsOpponent.map((g) => ({
    ...g,
    opponentName: g.team.name,
    ourScore: g.opponentScore,
    opponentScore: g.ourScore,
    isHome: !g.isHome,
  }));

  // Merge and sort by date
  const allGames = [...team.games, ...flippedGames]
    .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime())
    .slice(0, 20);

  const totalGames = team._count.games + gamesAsOpponent.length;

  return NextResponse.json({
    ...team,
    games: allGames,
    _count: { ...team._count, games: totalGames },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;
  const body = await req.json();

  const team = await prisma.team.updateMany({
    where: {
      id: teamId,
      organization: { ownerId: user.id },
    },
    data: {
      name: body.name,
      sport: body.sport,
      level: body.level,
      defaultInnings: body.defaultInnings,
    },
  });

  if (team.count === 0) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;

  const result = await prisma.team.deleteMany({
    where: {
      id: teamId,
      organization: { ownerId: user.id },
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

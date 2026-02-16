import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  // Get the current game
  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    include: { opponentBatters: true },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Skip if game already has opponent batters
  if (game.opponentBatters.length > 0) {
    return NextResponse.json([]);
  }

  // Find the most recent other game with the same opponent name for the same team
  const previousGame = await prisma.game.findFirst({
    where: {
      teamId: game.teamId,
      opponentName: { equals: game.opponentName, mode: "insensitive" },
      id: { not: gameId },
      opponentBatters: { some: {} },
    },
    orderBy: { gameDate: "desc" },
    include: {
      opponentBatters: { orderBy: { orderInGame: "asc" } },
    },
  });

  if (previousGame) {
    // Copy opponent batters from the previous game
    const created = await prisma.opponentBatter.createManyAndReturn({
      data: previousGame.opponentBatters.map((batter, idx) => ({
        gameId,
        name: batter.name,
        jerseyNumber: batter.jerseyNumber,
        bats: batter.bats,
        orderInGame: idx + 1,
      })),
    });
    return NextResponse.json(created, { status: 201 });
  }

  // Fallback: check if a team with a matching name exists in the user's organization
  const matchingTeam = await prisma.team.findFirst({
    where: {
      name: { equals: game.opponentName, mode: "insensitive" },
      organization: { ownerId: user.id },
      id: { not: game.teamId },
    },
    include: {
      players: {
        where: { isActive: true },
        orderBy: [{ jerseyNumber: "asc" }, { lastName: "asc" }],
      },
    },
  });

  if (!matchingTeam || matchingTeam.players.length === 0) {
    return NextResponse.json([]);
  }

  // Copy team players as opponent batters
  const created = await prisma.opponentBatter.createManyAndReturn({
    data: matchingTeam.players.map((player, idx) => ({
      gameId,
      name: `${player.firstName} ${player.lastName}`,
      jerseyNumber: player.jerseyNumber,
      bats: player.bats,
      orderInGame: idx + 1,
    })),
  });

  return NextResponse.json(created, { status: 201 });
}

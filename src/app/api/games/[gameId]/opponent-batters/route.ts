import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const batters = await prisma.opponentBatter.findMany({
    where: { gameId, game: { team: { organization: { ownerId: user.id } } } },
    orderBy: { orderInGame: "asc" },
  });

  return NextResponse.json(batters);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;
  const body = await req.json();

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const lastBatter = await prisma.opponentBatter.findFirst({
    where: { gameId },
    orderBy: { orderInGame: "desc" },
  });

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const batter = await prisma.opponentBatter.create({
    data: {
      gameId,
      name: body.name.trim(),
      jerseyNumber: body.jerseyNumber ?? null,
      bats: body.bats || "right",
      orderInGame: (lastBatter?.orderInGame || 0) + 1,
    },
  });

  return NextResponse.json(batter, { status: 201 });
}

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

  const pitchers = await prisma.opponentPitcher.findMany({
    where: { gameId, game: { team: { organization: { ownerId: user.id } } } },
    orderBy: { orderInGame: "asc" },
  });

  return NextResponse.json(pitchers);
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

  const lastPitcher = await prisma.opponentPitcher.findFirst({
    where: { gameId },
    orderBy: { orderInGame: "desc" },
  });

  const pitcher = await prisma.opponentPitcher.create({
    data: {
      gameId,
      name: body.name.trim(),
      throwsHand: body.throwsHand || "right",
      orderInGame: (lastPitcher?.orderInGame || 0) + 1,
    },
  });

  return NextResponse.json(pitcher, { status: 201 });
}

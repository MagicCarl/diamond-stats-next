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

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    include: {
      lineupEntries: {
        include: { player: true },
        orderBy: { battingOrder: "asc" },
      },
      atBats: {
        include: {
          player: true,
          opponentBatter: true,
          opponentPitcher: true,
          pitches: { orderBy: { pitchNumber: "asc" } },
        },
        orderBy: { atBatNumberInGame: "asc" },
      },
      pitchingAppearances: {
        include: { player: true },
        orderBy: { appearanceOrder: "asc" },
      },
      opponentPitchers: {
        orderBy: { orderInGame: "asc" },
      },
      opponentBatters: {
        orderBy: { orderInGame: "asc" },
      },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;
  const body = await req.json();

  const result = await prisma.game.updateMany({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    data: {
      status: body.status,
      ourScore: body.ourScore,
      opponentScore: body.opponentScore,
      currentInning: body.currentInning,
      isTopOfInning: body.isTopOfInning,
      outsInCurrentInning: body.outsInCurrentInning,
      notes: body.notes,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const result = await prisma.game.deleteMany({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;
  const body = await req.json();

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const atBat = await prisma.atBat.updateMany({
    where: { id: atBatId, gameId },
    data: {
      ...(body.stolenBases !== undefined && { stolenBases: body.stolenBases }),
      ...(body.caughtStealing !== undefined && { caughtStealing: body.caughtStealing }),
      ...(body.rbi !== undefined && { rbi: body.rbi }),
      ...(body.runnerScored !== undefined && { runnerScored: body.runnerScored }),
    },
  });

  if (atBat.count === 0) {
    return NextResponse.json({ error: "At-bat not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const result = await prisma.atBat.deleteMany({
    where: { id: atBatId, gameId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "At-bat not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

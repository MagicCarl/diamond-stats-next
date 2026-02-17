import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOutsProduced } from "@/lib/stats";

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

  // Recalculate game state from all remaining at-bats
  const remainingAtBats = await prisma.atBat.findMany({
    where: { gameId },
    orderBy: { atBatNumberInGame: "asc" },
  });

  let outs = 0;
  let inning = 1;
  let isTop = true;
  let ourScore = 0;
  let oppScore = 0;

  for (const ab of remainingAtBats) {
    const isOurs = !!ab.playerId;
    if (ab.runnerScored) {
      if (isOurs) ourScore += 1;
      else oppScore += 1;
    }
    if (isOurs) ourScore += ab.rbi;
    else oppScore += ab.rbi;

    outs += getOutsProduced(ab.result);
    if (outs >= 3) {
      outs = 0;
      if (isTop) {
        isTop = false;
      } else {
        isTop = true;
        inning += 1;
      }
    }
  }

  await prisma.game.update({
    where: { id: gameId },
    data: {
      outsInCurrentInning: outs,
      currentInning: inning,
      isTopOfInning: isTop,
      ourScore,
      opponentScore: oppScore,
    },
  });

  return NextResponse.json({ success: true });
}

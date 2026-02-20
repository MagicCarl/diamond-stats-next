import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOutsProduced } from "@/lib/stats";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const atBats = await prisma.atBat.findMany({
    where: { gameId, game: { team: { organization: { ownerId: user.id } } } },
    include: { player: true, opponentBatter: true, opponentPitcher: true, pitches: { orderBy: { pitchNumber: "asc" } } },
    orderBy: { atBatNumberInGame: "asc" },
  });

  return NextResponse.json(atBats);
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

  // Get next at-bat number
  const lastAtBat = await prisma.atBat.findFirst({
    where: { gameId },
    orderBy: { atBatNumberInGame: "desc" },
  });
  const nextNumber = (lastAtBat?.atBatNumberInGame || 0) + 1;

  const atBat = await prisma.atBat.create({
    data: {
      gameId,
      playerId: body.playerId || null,
      opponentBatterId: body.opponentBatterId || null,
      opponentPitcherId: body.opponentPitcherId || null,
      inning: body.inning || game.currentInning,
      isTop: body.isTop ?? game.isTopOfInning,
      atBatNumberInGame: nextNumber,
      result: body.result,
      rbi: body.rbi || 0,
      runnerScored: body.runnerScored || false,
      stolenBases: body.stolenBases || 0,
      caughtStealing: body.caughtStealing || 0,
      hitLocationX: body.hitLocationX ?? null,
      hitLocationY: body.hitLocationY ?? null,
      notes: body.notes || null,
    },
    include: { player: true, opponentBatter: true, opponentPitcher: true },
  });

  // Update game state: outs, score, inning
  const outsProduced = getOutsProduced(body.result);
  let newOuts = game.outsInCurrentInning + outsProduced;
  let newInning = game.currentInning;
  let newIsTop = game.isTopOfInning;
  let newScore = game.ourScore;
  let newOppScore = game.opponentScore;

  // Determine if this at-bat is for our team or opponent
  const isOurTeamBatting = !!body.playerId;

  // Add runs: RBI counts the runs scored on this play.
  // runnerScored tracks whether the batter scored (a stat), not an additional run.
  if (isOurTeamBatting) {
    newScore += body.rbi || 0;
  } else {
    newOppScore += body.rbi || 0;
  }

  // Check for inning change (3 outs)
  if (newOuts >= 3) {
    newOuts = 0;
    if (newIsTop) {
      newIsTop = false;
    } else {
      newIsTop = true;
      newInning += 1;
    }
  }

  await prisma.game.update({
    where: { id: gameId },
    data: {
      outsInCurrentInning: newOuts,
      currentInning: newInning,
      isTopOfInning: newIsTop,
      ourScore: newScore,
      opponentScore: newOppScore,
      status: "in_progress",
    },
  });

  return NextResponse.json(atBat, { status: 201 });
}

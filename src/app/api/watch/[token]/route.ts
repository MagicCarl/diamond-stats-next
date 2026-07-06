import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public, read-only game view for shared links. No auth — access is granted
// by knowing the unguessable share token. Returns a trimmed payload only
// (no pitches, notes, or opponent scouting data).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!token || token.length > 64) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const game = await prisma.game.findUnique({
    where: { shareToken: token },
    select: {
      opponentName: true,
      gameDate: true,
      isHome: true,
      inningsCount: true,
      status: true,
      ourScore: true,
      opponentScore: true,
      currentInning: true,
      isTopOfInning: true,
      team: { select: { name: true } },
      lineupEntries: {
        orderBy: { battingOrder: "asc" },
        select: {
          battingOrder: true,
          player: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      atBats: {
        orderBy: { atBatNumberInGame: "asc" },
        select: {
          id: true,
          playerId: true,
          result: true,
          rbi: true,
          stolenBases: true,
          runnerScored: true,
          inning: true,
          isTop: true,
          player: { select: { firstName: true, lastName: true } },
          opponentBatter: { select: { name: true } },
        },
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

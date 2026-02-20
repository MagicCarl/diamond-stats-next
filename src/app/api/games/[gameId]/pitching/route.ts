import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updatePitchingSchema = z.object({
  id: z.string().min(1, "id required"),
  outsRecorded: z.number().int().min(0).optional(),
  hitsAllowed: z.number().int().min(0).optional(),
  runsAllowed: z.number().int().min(0).optional(),
  earnedRuns: z.number().int().min(0).optional(),
  walks: z.number().int().min(0).optional(),
  strikeouts: z.number().int().min(0).optional(),
  homeRunsAllowed: z.number().int().min(0).optional(),
  pitchesThrown: z.number().int().min(0).nullable().optional(),
  hitBatters: z.number().int().min(0).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const appearances = await prisma.pitchingAppearance.findMany({
    where: { gameId, game: { team: { organization: { ownerId: user.id } } } },
    include: { player: true },
    orderBy: { appearanceOrder: "asc" },
  });

  return NextResponse.json(appearances);
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

  const lastAppearance = await prisma.pitchingAppearance.findFirst({
    where: { gameId },
    orderBy: { appearanceOrder: "desc" },
  });

  const appearance = await prisma.pitchingAppearance.create({
    data: {
      gameId,
      playerId: body.playerId,
      appearanceOrder: (lastAppearance?.appearanceOrder || 0) + 1,
      outsRecorded: body.outsRecorded || 0,
      hitsAllowed: body.hitsAllowed || 0,
      runsAllowed: body.runsAllowed || 0,
      earnedRuns: body.earnedRuns || 0,
      walks: body.walks || 0,
      strikeouts: body.strikeouts || 0,
      homeRunsAllowed: body.homeRunsAllowed || 0,
      pitchesThrown: body.pitchesThrown || null,
      hitBatters: body.hitBatters || 0,
    },
    include: { player: true },
  });

  return NextResponse.json(appearance, { status: 201 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;
  const parsed = updatePitchingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const body = parsed.data;

  const result = await prisma.pitchingAppearance.updateMany({
    where: {
      id: body.id,
      gameId,
      game: { team: { organization: { ownerId: user.id } } },
    },
    data: {
      outsRecorded: body.outsRecorded,
      hitsAllowed: body.hitsAllowed,
      runsAllowed: body.runsAllowed,
      earnedRuns: body.earnedRuns,
      walks: body.walks,
      strikeouts: body.strikeouts,
      homeRunsAllowed: body.homeRunsAllowed,
      pitchesThrown: body.pitchesThrown,
      hitBatters: body.hitBatters,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

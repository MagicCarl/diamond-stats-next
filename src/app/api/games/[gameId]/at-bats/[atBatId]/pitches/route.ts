import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;

  const pitches = await prisma.pitch.findMany({
    where: {
      atBatId,
      atBat: { gameId, game: { team: { organization: { ownerId: user.id } } } },
    },
    orderBy: { pitchNumber: "asc" },
  });

  return NextResponse.json(pitches);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;
  const body = await req.json();

  const atBat = await prisma.atBat.findFirst({
    where: {
      id: atBatId,
      gameId,
      game: { team: { organization: { ownerId: user.id } } },
    },
  });
  if (!atBat) {
    return NextResponse.json({ error: "At-bat not found" }, { status: 404 });
  }

  const lastPitch = await prisma.pitch.findFirst({
    where: { atBatId },
    orderBy: { pitchNumber: "desc" },
  });

  const pitch = await prisma.pitch.create({
    data: {
      atBatId,
      pitchNumber: (lastPitch?.pitchNumber || 0) + 1,
      result: body.result,
      locationX: body.locationX ?? null,
      locationY: body.locationY ?? null,
    },
  });

  // Update pitch count on the at-bat
  await prisma.atBat.update({
    where: { id: atBatId },
    data: { pitchCount: (lastPitch?.pitchNumber || 0) + 1 },
  });

  return NextResponse.json(pitch, { status: 201 });
}

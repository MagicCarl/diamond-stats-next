import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; playerId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId, playerId } = await params;

  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const body = await req.json();

  const player = await prisma.player.updateMany({
    where: { id: playerId, teamId },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      jerseyNumber: body.jerseyNumber,
      bats: body.bats,
      throwsHand: body.throwsHand,
      primaryPosition: body.primaryPosition,
      secondaryPosition: body.secondaryPosition,
    },
  });

  if (player.count === 0) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; playerId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId, playerId } = await params;

  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Soft delete
  const player = await prisma.player.updateMany({
    where: { id: playerId, teamId },
    data: { isActive: false },
  });

  if (player.count === 0) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

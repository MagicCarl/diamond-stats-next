import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updatePlayerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  jerseyNumber: z.number().int().min(0).max(99).nullable().optional(),
  bats: z.enum(["left", "right", "switch"]).optional(),
  throwsHand: z.enum(["left", "right"]).optional(),
  primaryPosition: z.string().trim().max(20).nullable().optional(),
  secondaryPosition: z.string().trim().max(20).nullable().optional(),
});

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

  const parsed = updatePlayerSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const body = parsed.data;

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

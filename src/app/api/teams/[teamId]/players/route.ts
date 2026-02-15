import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;

  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const players = await prisma.player.findMany({
    where: { teamId, isActive: true },
    orderBy: [{ jerseyNumber: "asc" }, { lastName: "asc" }],
  });

  return NextResponse.json(players);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;

  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const body = await req.json();

  if (!body.firstName?.trim() || !body.lastName?.trim()) {
    return NextResponse.json(
      { error: "First and last name are required" },
      { status: 400 }
    );
  }

  const player = await prisma.player.create({
    data: {
      teamId,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      jerseyNumber: body.jerseyNumber ?? null,
      bats: body.bats || "right",
      throwsHand: body.throwsHand || "right",
      primaryPosition: body.primaryPosition || null,
      secondaryPosition: body.secondaryPosition || null,
    },
  });

  return NextResponse.json(player, { status: 201 });
}

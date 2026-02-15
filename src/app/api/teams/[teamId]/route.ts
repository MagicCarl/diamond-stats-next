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
    where: {
      id: teamId,
      organization: { ownerId: user.id },
    },
    include: {
      players: { where: { isActive: true }, orderBy: { jerseyNumber: "asc" } },
      seasons: { orderBy: { createdAt: "desc" } },
      games: { orderBy: { gameDate: "desc" }, take: 20 },
      _count: { select: { players: true, games: true } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;
  const body = await req.json();

  const team = await prisma.team.updateMany({
    where: {
      id: teamId,
      organization: { ownerId: user.id },
    },
    data: {
      name: body.name,
      sport: body.sport,
      level: body.level,
      defaultInnings: body.defaultInnings,
    },
  });

  if (team.count === 0) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;

  const result = await prisma.team.deleteMany({
    where: {
      id: teamId,
      organization: { ownerId: user.id },
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const teamId = new URL(req.url).searchParams.get("teamId");
  if (!teamId) {
    return NextResponse.json({ error: "teamId required" }, { status: 400 });
  }

  const seasons = await prisma.season.findMany({
    where: { teamId, team: { organization: { ownerId: user.id } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(seasons);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { teamId, name, startDate, endDate } = body;

  if (!teamId || !name?.trim()) {
    return NextResponse.json(
      { error: "teamId and name are required" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const season = await prisma.season.create({
    data: {
      teamId,
      name: name.trim(),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json(season, { status: 201 });
}

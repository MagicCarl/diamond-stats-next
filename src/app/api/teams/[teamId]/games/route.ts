import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;

  // Verify team ownership
  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Delete all games for this team (cascades to at-bats, lineup entries, opponent batters, etc.)
  const result = await prisma.game.deleteMany({
    where: { teamId },
  });

  return NextResponse.json({ deleted: result.count });
}

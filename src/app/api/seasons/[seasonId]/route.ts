import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ seasonId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { seasonId } = await params;

  // Verify ownership through team -> organization
  const season = await prisma.season.findFirst({
    where: { id: seasonId, team: { organization: { ownerId: user.id } } },
  });

  if (!season) {
    return NextResponse.json({ error: "Season not found" }, { status: 404 });
  }

  // Unlink games from this season, then delete the season (in a transaction)
  await prisma.$transaction(async (tx) => {
    await tx.game.updateMany({
      where: { seasonId },
      data: { seasonId: null },
    });
    await tx.season.delete({ where: { id: seasonId } });
  });

  return NextResponse.json({ success: true });
}

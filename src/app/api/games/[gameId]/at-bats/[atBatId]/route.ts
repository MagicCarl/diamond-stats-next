import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const result = await prisma.atBat.deleteMany({
    where: { id: atBatId, gameId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "At-bat not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

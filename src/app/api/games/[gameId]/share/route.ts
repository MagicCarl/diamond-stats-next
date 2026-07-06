import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Creates (or returns the existing) public share token for a game.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    select: { id: true, shareToken: true },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (game.shareToken) {
    return NextResponse.json({ shareToken: game.shareToken });
  }

  const shareToken = randomBytes(12).toString("base64url");
  await prisma.game.update({
    where: { id: game.id },
    data: { shareToken },
  });

  return NextResponse.json({ shareToken });
}

// Revokes the public share link.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const result = await prisma.game.updateMany({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    data: { shareToken: null },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

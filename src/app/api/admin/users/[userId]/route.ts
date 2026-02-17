import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.isPaid !== undefined && { isPaid: body.isPaid }),
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      isPaid: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}

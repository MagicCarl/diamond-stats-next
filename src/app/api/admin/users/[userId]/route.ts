import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const patchUserSchema = z.object({
  isPaid: z.boolean().optional(),
  deletedAt: z.null().optional(),
});

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
  const parsed = patchUserSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const body = parsed.data;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(body.isPaid !== undefined && { isPaid: body.isPaid }),
      ...(body.deletedAt === null && { deletedAt: null }),
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      isPaid: true,
      isAdmin: true,
      deletedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;

  // Prevent admin from deleting themselves
  if (userId === user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Soft-delete: set deletedAt timestamp instead of destroying data
  // User will be blocked from signing in by getAuthUser() and /api/auth/verify
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
    select: {
      id: true,
      email: true,
      displayName: true,
      isPaid: true,
      isAdmin: true,
      deletedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}

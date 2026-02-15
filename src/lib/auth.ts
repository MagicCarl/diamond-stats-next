import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "./firebase-admin";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  theme: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split("Bearer ")[1];
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    return user;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

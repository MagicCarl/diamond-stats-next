import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "./firebase-admin";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  theme: string;
  isPaid: boolean;
  isAdmin: boolean;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!decoded.email) {
      return null;
    }
    // Look up existing user first (fast read), fall back to upsert if not found
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      user = await prisma.user.upsert({
        where: { firebaseUid: decoded.uid },
        update: {
          email: decoded.email,
          displayName: decoded.name || null,
        },
        create: {
          firebaseUid: decoded.uid,
          email: decoded.email,
          displayName: decoded.name || null,
        },
      });
    }
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

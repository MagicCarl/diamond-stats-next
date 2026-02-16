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
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("[getAuthUser] No Bearer token in Authorization header");
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    console.error("[getAuthUser] Empty token after Bearer");
    return null;
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    console.log("[getAuthUser] Token verified for uid:", decoded.uid);
    // Find or create user — ensures it works even if /api/auth/verify was blocked
    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email || "",
        displayName: decoded.name || null,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email || "",
        displayName: decoded.name || null,
      },
    });
    console.log("[getAuthUser] User found/created:", user.id);
    return user;
  } catch (error) {
    console.error("[getAuthUser] Error:", error instanceof Error ? error.message : error);
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

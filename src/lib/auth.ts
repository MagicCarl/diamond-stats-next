import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "./firebase-admin";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  theme: string;
  language: string;
  isPaid: boolean;
  isAdmin: boolean;
}

// Accounts created on/after this instant must have a VERIFIED email to access
// the app. Accounts created earlier are grandfathered (so existing users —
// including a paid user who never verified — are not locked out). The display
// name requirement below applies to ALL accounts, old and new.
export const EMAIL_VERIFY_ENFORCED_SINCE = new Date("2026-06-01T00:00:00Z");

export type AccessBlock = "DELETED" | "NAME_REQUIRED" | "EMAIL_NOT_VERIFIED";

/**
 * Returns a reason string if this user must be denied access, or null if the
 * user is allowed. Shared by getAuthUser (data APIs) and /api/auth/verify
 * (login sync) so both gates apply identical rules.
 */
export function accessBlockReason(
  user: { displayName: string | null; deletedAt: Date | null; createdAt: Date },
  decoded: { email_verified?: boolean },
): AccessBlock | null {
  if (user.deletedAt) return "DELETED";
  if (!user.displayName || user.displayName.trim() === "") return "NAME_REQUIRED";
  if (user.createdAt >= EMAIL_VERIFY_ENFORCED_SINCE && !decoded.email_verified) {
    return "EMAIL_NOT_VERIFIED";
  }
  return null;
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
    // Look up existing user first (fast read).
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    if (!user) {
      // New account: only persist a user row once the email is verified and a
      // name is present. Unverified/nameless signups never become users.
      if (!decoded.email_verified || !decoded.name) {
        return null;
      }
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email,
          displayName: decoded.name,
        },
      });
    }
    // Block soft-deleted, nameless, or (for non-grandfathered) unverified users.
    if (accessBlockReason(user, decoded)) {
      return null;
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

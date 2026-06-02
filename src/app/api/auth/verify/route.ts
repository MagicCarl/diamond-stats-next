import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { accessBlockReason } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email || "",
        // Only set the name when the token carries one — never clobber an
        // existing display name back to null on a routine login.
        ...(decoded.name ? { displayName: decoded.name } : {}),
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email || "",
        displayName: decoded.name || null,
      },
    });

    // Enforce access rules: soft-deleted, nameless, or (for new accounts)
    // unverified-email users are blocked. The frontend reads `code` to show
    // the right message and trigger email re-verification when appropriate.
    const block = accessBlockReason(user, decoded);
    if (block) {
      const error =
        block === "DELETED"
          ? "Account suspended"
          : block === "NAME_REQUIRED"
            ? "A name is required on your account"
            : "Please verify your email address before signing in";
      return NextResponse.json({ error, code: block }, { status: 403 });
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isPaid: user.isPaid,
        isAdmin: user.isAdmin,
        language: user.language,
      },
    });

    response.cookies.set("NEXT_LOCALE", user.language, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}

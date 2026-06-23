import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { accessBlockReason } from "@/lib/auth";
import { trackServerEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);

    const errorFor = (code: string) =>
      code === "DELETED"
        ? "Account suspended"
        : code === "NAME_REQUIRED"
          ? "A name is required on your account"
          : "Please verify your email address before signing in";

    let user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      // New account: do NOT persist a user row until the email is verified
      // and a name is present. Unverified/nameless signups never become users.
      if (!decoded.email_verified || !decoded.name) {
        const code = !decoded.name ? "NAME_REQUIRED" : "EMAIL_NOT_VERIFIED";
        return NextResponse.json({ error: errorFor(code), code }, { status: 403 });
      }
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email || "",
          displayName: decoded.name,
        },
      });
      const ref = req.cookies.get("ref")?.value;
      trackServerEvent("SIGNUP", user.id, ref ? { ref } : undefined);
    } else {
      // Existing account: keep email/name fresh without clobbering a name.
      user = await prisma.user.update({
        where: { firebaseUid: decoded.uid },
        data: {
          email: decoded.email || "",
          ...(decoded.name ? { displayName: decoded.name } : {}),
        },
      });
    }

    // Enforce access rules: soft-deleted, nameless, or (for non-grandfathered
    // accounts) unverified-email users are blocked. The frontend reads `code`.
    const block = accessBlockReason(user, decoded);
    if (block) {
      return NextResponse.json(
        { error: errorFor(block), code: block },
        { status: 403 },
      );
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

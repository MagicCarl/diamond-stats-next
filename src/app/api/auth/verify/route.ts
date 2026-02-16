import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

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
        displayName: decoded.name || null,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email || "",
        displayName: decoded.name || null,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Auth verify error:", error?.message || error);
    return NextResponse.json(
      { error: "Invalid token", details: error?.message || "Unknown error" },
      { status: 401 }
    );
  }
}

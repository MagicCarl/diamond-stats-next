import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Only admins can see detailed health info
  const user = await getAuthUser(req);
  if (!user?.isAdmin) {
    return NextResponse.json({ status: "ok" });
  }

  const results: Record<string, unknown> = {};
  results.status = "ok";

  // Test Firebase Admin init
  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const auth = getAdminAuth();
    results.firebaseAdmin = auth ? "OK" : "null";
  } catch (e: unknown) {
    results.firebaseAdmin = `ERROR: ${e instanceof Error ? e.message : "unknown"}`;
  }

  // Test Database connection
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1 as test`;
    results.database = "OK";
  } catch (e: unknown) {
    results.database = `ERROR: ${e instanceof Error ? e.message : "unknown"}`;
  }

  return NextResponse.json(results);
}

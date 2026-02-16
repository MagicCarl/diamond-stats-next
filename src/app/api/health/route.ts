import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Test 1: Check env vars
  results.firebaseProjectId = process.env.FIREBASE_PROJECT_ID ?? "NOT SET";
  results.firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? "NOT SET";
  results.privateKeyLength = process.env.FIREBASE_PRIVATE_KEY?.length ?? 0;
  results.privateKeyStart = process.env.FIREBASE_PRIVATE_KEY?.substring(0, 27);
  results.privateKeyEnd = process.env.FIREBASE_PRIVATE_KEY?.substring(
    (process.env.FIREBASE_PRIVATE_KEY?.length ?? 0) - 30
  );
  results.privateKeyHasLiteralNewlines = process.env.FIREBASE_PRIVATE_KEY?.includes("\\n") ?? false;
  results.privateKeyHasRealNewlines = process.env.FIREBASE_PRIVATE_KEY?.includes("\n") ?? false;
  results.databaseHost = process.env.DATABASE_URL?.match(/@([^:\/]+)/)?.[1] ?? "unknown";
  // Check what the .replace actually produces
  const processedKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  results.processedKeyLength = processedKey?.length ?? 0;
  results.processedKeyStart = processedKey?.substring(0, 27);
  results.processedKeyEnd = processedKey?.substring((processedKey?.length ?? 0) - 30);

  // Test 2: Firebase Admin init
  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const auth = getAdminAuth();
    results.firebaseAdmin = auth ? "OK" : "null";
  } catch (e: unknown) {
    results.firebaseAdmin = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 3: Firebase Admin API call (actually tests the private key)
  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const auth = getAdminAuth();
    await auth.listUsers(1);
    results.firebaseAdminApi = "OK";
  } catch (e: unknown) {
    results.firebaseAdminApi = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 4: Database raw query
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1 as test`;
    results.databaseRaw = "OK";
  } catch (e: unknown) {
    results.databaseRaw = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 5: Prisma model query
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    results.databaseModel = `OK (${count} users)`;
  } catch (e: unknown) {
    results.databaseModel = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results);
}

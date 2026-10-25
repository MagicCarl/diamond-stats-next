import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Daily Vercel Cron Job (vercel.json → crons). Supabase's free plan pauses a
// project after a stretch with no activity, which takes the whole app down:
// sign-in fails for everyone and pages load empty. One small query a day keeps
// the database counted as active.
export async function GET(req: NextRequest) {
  // Vercel sends CRON_SECRET as "Authorization: Bearer <secret>" on every run.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.count();
    return NextResponse.json({ ok: true, users });
  } catch (e) {
    console.error("keep-alive: database unreachable", e);
    return NextResponse.json({ ok: false, error: "Database unreachable" }, { status: 503 });
  }
}

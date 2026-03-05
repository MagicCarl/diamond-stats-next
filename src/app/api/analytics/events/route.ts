import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod/v4";

const EVENT_TYPES = [
  "LOGIN",
  "PAGE_VIEW",
  "GAME_CREATED",
  "PAYMENT_TOGGLED",
  "TEAM_CREATED",
  "SIGNUP",
] as const;

const createEventSchema = z.object({
  eventType: z.enum(EVENT_TYPES),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);

  const parsed = createEventSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { eventType, metadata } = parsed.data;

  await prisma.analyticsEvent.create({
    data: {
      eventType,
      userId: user?.id ?? null,
      metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

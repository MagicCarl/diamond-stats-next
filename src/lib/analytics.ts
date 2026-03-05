import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function trackServerEvent(
  eventType: string,
  userId?: string | null,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        userId: userId ?? null,
        metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
      },
    });
  } catch {
    // Never let analytics tracking break the main flow
    console.error("Failed to track analytics event:", eventType);
  }
}

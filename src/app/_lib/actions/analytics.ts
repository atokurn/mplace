"use server"

import { db } from "@/lib/db"
import { analyticsEvents } from "@/lib/db/schema"
import { handleError } from "@/lib/handle-error"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { and, eq, inArray } from "drizzle-orm"

const createAnalyticsEventSchema = z.object({
  eventType: z.enum(["page_view", "product_view", "add_to_cart", "purchase", "search", "download"]),
  userId: z.string().optional(),
  sessionId: z.string(),
  metadata: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  referrer: z.string().optional(),
  url: z.string(),
})

const deleteAnalyticsEventsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one event must be selected"),
})

const updateAnalyticsEventSchema = z.object({
  eventType: z.enum(["page_view", "product_view", "add_to_cart", "purchase", "search", "download"]).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function createAnalyticsEvent(input: z.infer<typeof createAnalyticsEventSchema>) {
  try {
    const data = createAnalyticsEventSchema.parse(input)

    const [event] = await db
      .insert(analyticsEvents)
      .values({
        ...data,
        metadata: data.metadata || {},
      })
      .returning()

    revalidatePath("/analytics")

    return {
      data: event,
      error: null,
    }
  } catch (err) {
    return handleError(err)
  }
}

export async function deleteAnalyticsEvents(input: z.infer<typeof deleteAnalyticsEventsSchema>) {
  try {
    const { ids } = deleteAnalyticsEventsSchema.parse(input)

    await db.delete(analyticsEvents).where(inArray(analyticsEvents.id, ids))

    revalidatePath("/analytics")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return handleError(err)
  }
}

export async function updateAnalyticsEvent(input: { id: string } & z.infer<typeof updateAnalyticsEventSchema>) {
  try {
    const { id, ...updateData } = input
    const data = updateAnalyticsEventSchema.parse(updateData)

    const [event] = await db
      .update(analyticsEvents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(analyticsEvents.id, id))
      .returning()

    revalidatePath("/analytics")

    return {
      data: event,
      error: null,
    }
  } catch (err) {
    return handleError(err)
  }
}

export async function deleteAnalyticsEvent(input: { id: string }) {
  try {
    const { id } = input

    await db.delete(analyticsEvents).where(eq(analyticsEvents.id, id))

    revalidatePath("/analytics")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return handleError(err)
  }
}

// Bulk operations for analytics cleanup
export async function cleanupOldAnalyticsEvents(daysOld: number = 90) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    await db
      .delete(analyticsEvents)
      .where(eq(analyticsEvents.createdAt, cutoffDate))

    revalidatePath("/analytics")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return handleError(err)
  }
}

export type CreateAnalyticsEventInput = z.infer<typeof createAnalyticsEventSchema>
export type DeleteAnalyticsEventsInput = z.infer<typeof deleteAnalyticsEventsSchema>
export type UpdateAnalyticsEventInput = z.infer<typeof updateAnalyticsEventSchema>
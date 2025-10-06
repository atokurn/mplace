import { analyticsSearchParamsCache } from "@/lib/search-params"
import { z } from "zod"

export const searchParamsSchemaAnalytics = analyticsSearchParamsCache

export type GetAnalyticsSchema = {
  page: number
  per_page: number
  sort: string
  eventType: ("page_view" | "product_view" | "add_to_cart" | "purchase" | "search")[]
  userId: string
  dateFrom: string
  dateTo: string
  operator: "and" | "or"
}

export const createAnalyticsEventSchema = z.object({
  eventType: z.enum(["page_view", "product_view", "add_to_cart", "purchase", "search"]),
  userId: z.string().optional(),
  sessionId: z.string(),
  metadata: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  referrer: z.string().optional(),
  url: z.string(),
})

export const updateAnalyticsEventSchema = z.object({
  eventType: z.enum(["page_view", "product_view", "add_to_cart", "purchase", "search"]).optional(),
  metadata: z.record(z.any()).optional(),
})

export const analyticsEventIdSchema = z.object({
  id: z.string(),
})

export const deleteAnalyticsEventsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one event must be selected"),
})

export const analyticsDateRangeSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const analyticsOverviewSchema = z.object({
  days: z.number().min(1).max(365).default(30),
})

export type CreateAnalyticsEventSchema = z.infer<typeof createAnalyticsEventSchema>
export type UpdateAnalyticsEventSchema = z.infer<typeof updateAnalyticsEventSchema>
export type AnalyticsEventIdSchema = z.infer<typeof analyticsEventIdSchema>
export type DeleteAnalyticsEventsSchema = z.infer<typeof deleteAnalyticsEventsSchema>
export type AnalyticsDateRangeSchema = z.infer<typeof analyticsDateRangeSchema>
export type AnalyticsOverviewSchema = z.infer<typeof analyticsOverviewSchema>
import { z } from "zod"
import { createSearchParamsCache } from "nuqs/server"
import { parseAsInteger, parseAsString } from "nuqs"

// Dashboard search params cache
export const dashboardSearchParamsCache = createSearchParamsCache({
  // Time range for metrics
  timeRange: parseAsString.withDefault("30"), // days
  
  // Metric type filter
  metricType: parseAsString.withDefault("overview"), // overview, sales, analytics, growth
  
  // Refresh interval
  refreshInterval: parseAsInteger.withDefault(300), // seconds
})

// Dashboard time range schema
export const dashboardTimeRangeSchema = z.object({
  days: z.number().int().min(1).max(365).default(30),
})

// Dashboard metric type schema
export const dashboardMetricTypeSchema = z.enum([
  "overview",
  "sales", 
  "analytics",
  "growth",
  "activity"
])

// Dashboard refresh schema
export const dashboardRefreshSchema = z.object({
  metricTypes: z.array(dashboardMetricTypeSchema).optional(),
  force: z.boolean().default(false),
})

// Dashboard export schema
export const dashboardExportSchema = z.object({
  type: z.enum(["overview", "sales", "analytics", "users", "orders", "products"]),
  format: z.enum(["csv", "json", "pdf"]).default("csv"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  includeDetails: z.boolean().default(false),
})

// Dashboard filter schema
export const dashboardFilterSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  category: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
})

// Dashboard widget configuration schema
export const dashboardWidgetConfigSchema = z.object({
  id: z.string(),
  type: z.enum([
    "overview",
    "recent-orders", 
    "recent-users",
    "top-products",
    "sales-chart",
    "analytics-chart",
    "growth-metrics",
    "activity-feed"
  ]),
  title: z.string(),
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    width: z.number().int().min(1).max(12),
    height: z.number().int().min(1).max(12),
  }),
  settings: z.record(z.any()).optional(),
  visible: z.boolean().default(true),
})

// Dashboard layout schema
export const dashboardLayoutSchema = z.object({
  widgets: z.array(dashboardWidgetConfigSchema),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  autoRefresh: z.boolean().default(true),
  refreshInterval: z.number().int().min(30).max(3600).default(300), // 30 seconds to 1 hour
})

// Type exports
export type DashboardTimeRange = z.infer<typeof dashboardTimeRangeSchema>
export type DashboardMetricType = z.infer<typeof dashboardMetricTypeSchema>
export type DashboardRefresh = z.infer<typeof dashboardRefreshSchema>
export type DashboardExport = z.infer<typeof dashboardExportSchema>
export type DashboardFilter = z.infer<typeof dashboardFilterSchema>
export type DashboardWidgetConfig = z.infer<typeof dashboardWidgetConfigSchema>
export type DashboardLayout = z.infer<typeof dashboardLayoutSchema>
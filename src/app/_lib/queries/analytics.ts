"use server"

import { db } from "@/lib/db"
import { analyticsEvents, users } from "@/lib/db/schema"
import { and, count, desc, asc, eq, ilike, inArray, or, gte, lte, sql } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import type { GetAnalyticsSchema } from "@/app/_lib/validations/analytics"

export async function getAnalyticsEvents(input: GetAnalyticsSchema) {
  return await unstable_cache(
    async () => {
      const { page, per_page, sort, eventType, userId, dateFrom, dateTo, operator } = input
      const offset = (page - 1) * per_page
      const [sortField, sortOrder] = sort?.split(".") ?? ["createdAt", "desc"]

      // Build where conditions
      const conditions = []

      if (eventType && eventType.length > 0) {
        conditions.push(inArray(analyticsEvents.eventType, eventType))
      }

      if (userId) {
        conditions.push(eq(analyticsEvents.userId, userId))
      }

      if (dateFrom) {
        conditions.push(gte(analyticsEvents.createdAt, new Date(dateFrom)))
      }

      if (dateTo) {
        conditions.push(lte(analyticsEvents.createdAt, new Date(dateTo)))
      }

      const whereClause = conditions.length > 0 
        ? operator === "and" 
          ? and(...conditions)
          : or(...conditions)
        : undefined

      const orderByClause = sortOrder === "desc" 
        ? desc(analyticsEvents[sortField as keyof typeof analyticsEvents] || analyticsEvents.createdAt)
        : asc(analyticsEvents[sortField as keyof typeof analyticsEvents] || analyticsEvents.createdAt)

      const [data, totalResult] = await Promise.all([
        db
          .select({
            id: analyticsEvents.id,
            eventType: analyticsEvents.eventType,
            userId: analyticsEvents.userId,
            sessionId: analyticsEvents.sessionId,
            metadata: analyticsEvents.metadata,
            userAgent: analyticsEvents.userAgent,
            ipAddress: analyticsEvents.ipAddress,
            referrer: analyticsEvents.referrer,
            url: analyticsEvents.url,
            createdAt: analyticsEvents.createdAt,
            user: {
              id: users.id,
              name: users.name,
              email: users.email,
            },
          })
          .from(analyticsEvents)
          .leftJoin(users, eq(analyticsEvents.userId, users.id))
          .where(whereClause)
          .orderBy(orderByClause)
          .limit(per_page)
          .offset(offset),
        
        db
          .select({ count: count() })
          .from(analyticsEvents)
          .where(whereClause)
      ])

      const total = totalResult[0]?.count ?? 0
      const pageCount = Math.ceil(total / per_page)

      return {
        data,
        pageCount,
        total,
      }
    },
    [`analytics-events-${JSON.stringify(input)}`],
    {
      revalidate: 60, // 1 minute for real-time analytics
      tags: ["analytics"],
    }
  )()
}

export async function getAnalyticsEventById(id: string) {
  return await unstable_cache(
    async () => {
      const [event] = await db
        .select({
          id: analyticsEvents.id,
          eventType: analyticsEvents.eventType,
          userId: analyticsEvents.userId,
          sessionId: analyticsEvents.sessionId,
          metadata: analyticsEvents.metadata,
          userAgent: analyticsEvents.userAgent,
          ipAddress: analyticsEvents.ipAddress,
          referrer: analyticsEvents.referrer,
          url: analyticsEvents.url,
          createdAt: analyticsEvents.createdAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(analyticsEvents)
        .leftJoin(users, eq(analyticsEvents.userId, users.id))
        .where(eq(analyticsEvents.id, id))

      return event
    },
    [`analytics-event-${id}`],
    {
      revalidate: 300,
      tags: [`analytics-event-${id}`, "analytics"],
    }
  )()
}

export async function getAnalyticsEventTypeCounts() {
  return await unstable_cache(
    async () => {
      const result = await db
        .select({
          eventType: analyticsEvents.eventType,
          count: count(),
        })
        .from(analyticsEvents)
        .groupBy(analyticsEvents.eventType)
        .orderBy(desc(count()))

      return result.reduce((acc, item) => {
        acc[item.eventType] = item.count
        return acc
      }, {} as Record<string, number>)
    },
    ["analytics-event-type-counts"],
    {
      revalidate: 300,
      tags: ["analytics"],
    }
  )()
}

export async function getAnalyticsOverview(days: number = 30) {
  return await unstable_cache(
    async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [totalEvents, uniqueUsers, topPages, eventsByDay] = await Promise.all([
        // Total events
        db
          .select({ count: count() })
          .from(analyticsEvents)
          .where(gte(analyticsEvents.createdAt, startDate)),
        
        // Unique users
        db
          .select({ count: sql<number>`COUNT(DISTINCT ${analyticsEvents.userId})` })
          .from(analyticsEvents)
          .where(and(
            gte(analyticsEvents.createdAt, startDate),
            eq(analyticsEvents.userId, sql`${analyticsEvents.userId}`)
          )),
        
        // Top pages
        db
          .select({
            url: analyticsEvents.url,
            count: count(),
          })
          .from(analyticsEvents)
          .where(and(
            gte(analyticsEvents.createdAt, startDate),
            eq(analyticsEvents.eventType, "page_view")
          ))
          .groupBy(analyticsEvents.url)
          .orderBy(desc(count()))
          .limit(10),
        
        // Events by day
        db
          .select({
            date: sql<string>`DATE(${analyticsEvents.createdAt})`,
            count: count(),
          })
          .from(analyticsEvents)
          .where(gte(analyticsEvents.createdAt, startDate))
          .groupBy(sql`DATE(${analyticsEvents.createdAt})`)
          .orderBy(sql`DATE(${analyticsEvents.createdAt})`)
      ])

      return {
        totalEvents: totalEvents[0]?.count ?? 0,
        uniqueUsers: uniqueUsers[0]?.count ?? 0,
        topPages,
        eventsByDay,
      }
    },
    [`analytics-overview-${days}`],
    {
      revalidate: 300,
      tags: ["analytics"],
    }
  )()
}

export async function getAnalyticsForExport(dateFrom?: string, dateTo?: string) {
  return await unstable_cache(
    async () => {
      const conditions = []
      
      if (dateFrom) {
        conditions.push(gte(analyticsEvents.createdAt, new Date(dateFrom)))
      }
      
      if (dateTo) {
        conditions.push(lte(analyticsEvents.createdAt, new Date(dateTo)))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      return await db
        .select({
          id: analyticsEvents.id,
          eventType: analyticsEvents.eventType,
          userId: analyticsEvents.userId,
          sessionId: analyticsEvents.sessionId,
          url: analyticsEvents.url,
          referrer: analyticsEvents.referrer,
          userAgent: analyticsEvents.userAgent,
          ipAddress: analyticsEvents.ipAddress,
          createdAt: analyticsEvents.createdAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(analyticsEvents)
        .leftJoin(users, eq(analyticsEvents.userId, users.id))
        .where(whereClause)
        .orderBy(desc(analyticsEvents.createdAt))
    },
    [`analytics-export-${dateFrom}-${dateTo}`],
    {
      revalidate: 300,
      tags: ["analytics"],
    }
  )()
}
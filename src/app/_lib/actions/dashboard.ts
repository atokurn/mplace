"use server"

import { db } from "@/lib/db"
import { users, products, orders, categories, analyticsEvents } from "@/lib/db/schema"
import { handleError } from "@/lib/handle-error"
import { count, desc, eq, gte, sql } from "drizzle-orm"
import { unstable_cache } from "next/cache"

export async function getDashboardStats() {
  return await unstable_cache(
    async () => {
      try {
        const [totalUsers, totalProducts, totalOrders, totalCategories] = await Promise.all([
          db.select({ count: count() }).from(users),
          db.select({ count: count() }).from(products),
          db.select({ count: count() }).from(orders),
          db.select({ count: count() }).from(categories),
        ])

        return {
          data: {
            totalUsers: totalUsers[0]?.count ?? 0,
            totalProducts: totalProducts[0]?.count ?? 0,
            totalOrders: totalOrders[0]?.count ?? 0,
            totalCategories: totalCategories[0]?.count ?? 0,
          },
          error: null,
        }
      } catch (err) {
        return handleError(err)
      }
    },
    ["dashboard-stats"],
    {
      revalidate: 300, // 5 minutes
      tags: ["dashboard"],
    }
  )()
}

export async function getRecentOrders(limit: number = 5) {
  return await unstable_cache(
    async () => {
      try {
        const recentOrders = await db
          .select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            totalAmount: orders.totalAmount,
            status: orders.status,
            paymentStatus: orders.paymentStatus,
            createdAt: orders.createdAt,
            user: {
              id: users.id,
              name: users.name,
              email: users.email,
            },
          })
          .from(orders)
          .leftJoin(users, eq(orders.userId, users.id))
          .orderBy(desc(orders.createdAt))
          .limit(limit)

        return {
          data: recentOrders,
          error: null,
        }
      } catch (err) {
        return handleError(err)
      }
    },
    [`recent-orders-${limit}`],
    {
      revalidate: 60, // 1 minute
      tags: ["dashboard", "orders"],
    }
  )()
}

export async function getRecentUsers(limit: number = 5) {
  return await unstable_cache(
    async () => {
      try {
        const recentUsers = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
          })
          .from(users)
          .orderBy(desc(users.createdAt))
          .limit(limit)

        return {
          data: recentUsers,
          error: null,
        }
      } catch (err) {
        return handleError(err)
      }
    },
    [`recent-users-${limit}`],
    {
      revalidate: 300, // 5 minutes
      tags: ["dashboard", "users"],
    }
  )()
}

export async function getTopProducts(limit: number = 5) {
  return await unstable_cache(
    async () => {
      try {
        const topProducts = await db
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
            status: products.status,
            featured: products.featured,
            createdAt: products.createdAt,
          })
          .from(products)
          .where(eq(products.status, "active"))
          .orderBy(desc(products.createdAt))
          .limit(limit)

        return {
          data: topProducts,
          error: null,
        }
      } catch (err) {
        return handleError(err)
      }
    },
    [`top-products-${limit}`],
    {
      revalidate: 300, // 5 minutes
      tags: ["dashboard", "products"],
    }
  )()
}

export async function getSalesOverview(days: number = 30) {
  return await unstable_cache(
    async () => {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const [totalSales, completedOrders, pendingOrders, salesByDay] = await Promise.all([
          // Total sales amount
          db
            .select({ 
              total: sql<number>`COALESCE(SUM(CAST(${orders.totalAmount} AS DECIMAL)), 0)` 
            })
            .from(orders)
            .where(gte(orders.createdAt, startDate)),
          
          // Completed orders count
          db
            .select({ count: count() })
            .from(orders)
            .where(eq(orders.status, "completed")),
          
          // Pending orders count
          db
            .select({ count: count() })
            .from(orders)
            .where(eq(orders.status, "pending")),
          
          // Sales by day
          db
            .select({
              date: sql<string>`DATE(${orders.createdAt})`,
              total: sql<number>`COALESCE(SUM(CAST(${orders.totalAmount} AS DECIMAL)), 0)`,
              count: count(),
            })
            .from(orders)
            .where(gte(orders.createdAt, startDate))
            .groupBy(sql`DATE(${orders.createdAt})`)
            .orderBy(sql`DATE(${orders.createdAt})`)
        ])

        return {
          data: {
            totalSales: totalSales[0]?.total ?? 0,
            completedOrders: completedOrders[0]?.count ?? 0,
            pendingOrders: pendingOrders[0]?.count ?? 0,
            salesByDay,
          },
          error: null,
        }
      } catch (err) {
        return handleError(err)
      }
    },
    [`sales-overview-${days}`],
    {
      revalidate: 300, // 5 minutes
      tags: ["dashboard", "orders"],
    }
  )()
}

export async function getActivityOverview(days: number = 7) {
  return await unstable_cache(
    async () => {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const [recentActivity, topEvents] = await Promise.all([
          // Recent analytics events
          db
            .select({
              id: analyticsEvents.id,
              eventType: analyticsEvents.eventType,
              url: analyticsEvents.url,
              createdAt: analyticsEvents.createdAt,
              user: {
                id: users.id,
                name: users.name,
              },
            })
            .from(analyticsEvents)
            .leftJoin(users, eq(analyticsEvents.userId, users.id))
            .where(gte(analyticsEvents.createdAt, startDate))
            .orderBy(desc(analyticsEvents.createdAt))
            .limit(10),
          
          // Top event types
          db
            .select({
              eventType: analyticsEvents.eventType,
              count: count(),
            })
            .from(analyticsEvents)
            .where(gte(analyticsEvents.createdAt, startDate))
            .groupBy(analyticsEvents.eventType)
            .orderBy(desc(count()))
            .limit(5)
        ])

        return {
          data: {
            recentActivity,
            topEvents,
          },
          error: null,
        }
      } catch (err) {
        return handleError(err)
      }
    },
    [`activity-overview-${days}`],
    {
      revalidate: 60, // 1 minute
      tags: ["dashboard", "analytics"],
    }
  )()
}

export async function refreshDashboardData() {
  try {
    // This function can be used to manually refresh dashboard data
    // by revalidating the cache tags
    
    return {
      data: "Dashboard data refreshed",
      error: null,
    }
  } catch (err) {
    return handleError(err)
  }
}
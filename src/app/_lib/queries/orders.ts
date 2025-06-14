import "server-only"

import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"
import { orders, orderItems, products, users, type SelectOrder } from "@/lib/db/schema"
import { buildFilterWhere } from "@/lib/filter-columns"
import { ordersSearchParamsCache } from "@/lib/search-params"
import { and, asc, count, desc, eq, ilike, or, sql, sum } from "drizzle-orm"

export async function getOrders(input: ReturnType<typeof ordersSearchParamsCache.parse>) {
  return await unstable_cache(
    async () => {
      const { page, per_page, sort, orderNumber, status, paymentStatus, operator } = input

      try {
        // Offset to paginate the results
        const offset = (page - 1) * per_page

        // Column and order to sort by
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
          "createdAt",
          "desc",
        ]) as [keyof SelectOrder | undefined, "asc" | "desc" | undefined]

        // Convert the column name to the actual column in the database
        const orderBy =
          column && column in orders
            ? order === "asc"
              ? asc(orders[column])
              : desc(orders[column])
            : desc(orders.createdAt)

        const expressions = [
          orderNumber
            ? ilike(orders.orderNumber, `%${orderNumber}%`)
            : undefined,
          status
            ? eq(orders.status, status)
            : undefined,
          paymentStatus
            ? eq(orders.paymentStatus, paymentStatus)
            : undefined,
        ].filter(Boolean)

        const where = buildFilterWhere({
          column: "orderNumber",
          value: expressions,
          operator,
          isSelectable: false,
        })

        // Transaction is used to ensure both queries are executed in a single transaction
        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
            .select({
              id: orders.id,
              orderNumber: orders.orderNumber,
              userId: orders.userId,
              userName: users.name,
              userEmail: users.email,
              status: orders.status,
              totalAmount: orders.totalAmount,
              currency: orders.currency,
              paymentMethod: orders.paymentMethod,
              paymentStatus: orders.paymentStatus,
              paymentId: orders.paymentId,
              notes: orders.notes,
              createdAt: orders.createdAt,
              updatedAt: orders.updatedAt,
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .limit(per_page)
            .offset(offset)
            .where(where)
            .orderBy(orderBy)

          const total = await tx
            .select({
              count: count(),
            })
            .from(orders)
            .leftJoin(users, eq(orders.userId, users.id))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

          return {
            data,
            total,
          }
        })

        const pageCount = Math.ceil(total / per_page)
        return { data, pageCount }
      } catch (err) {
        return { data: [], pageCount: 0 }
      }
    },
    [`orders-${JSON.stringify(input)}`],
    {
      revalidate: 3600, // every hour
      tags: [`orders`],
    }
  )()
}

export async function getOrderById(id: string) {
  return await unstable_cache(
    async () => {
      try {
        const order = await db
          .select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            userId: orders.userId,
            userName: users.name,
            userEmail: users.email,
            status: orders.status,
            totalAmount: orders.totalAmount,
            currency: orders.currency,
            paymentMethod: orders.paymentMethod,
            paymentStatus: orders.paymentStatus,
            paymentId: orders.paymentId,
            notes: orders.notes,
            createdAt: orders.createdAt,
            updatedAt: orders.updatedAt,
          })
          .from(orders)
          .leftJoin(users, eq(orders.userId, users.id))
          .where(eq(orders.id, id))
          .limit(1)

        if (!order[0]) return null

        // Get order items
        const items = await db
          .select({
            id: orderItems.id,
            productId: orderItems.productId,
            productTitle: products.title,
            productImageUrl: products.imageUrl,
            quantity: orderItems.quantity,
            unitPrice: orderItems.unitPrice,
            totalPrice: orderItems.totalPrice,
            createdAt: orderItems.createdAt,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, id))

        return {
          ...order[0],
          items,
        }
      } catch (err) {
        return null
      }
    },
    [`order-${id}`],
    {
      revalidate: 3600,
      tags: [`order-${id}`, `orders`],
    }
  )()
}

export async function getOrderStatusCounts() {
  return await unstable_cache(
    async () => {
      try {
        const statusCounts = await db
          .select({
            status: orders.status,
            count: count(),
          })
          .from(orders)
          .groupBy(orders.status)

        return {
          pending: statusCounts.find((item) => item.status === "pending")?.count ?? 0,
          processing: statusCounts.find((item) => item.status === "processing")?.count ?? 0,
          completed: statusCounts.find((item) => item.status === "completed")?.count ?? 0,
          cancelled: statusCounts.find((item) => item.status === "cancelled")?.count ?? 0,
          refunded: statusCounts.find((item) => item.status === "refunded")?.count ?? 0,
        }
      } catch (err) {
        return {
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0,
          refunded: 0,
        }
      }
    },
    ["order-status-counts"],
    {
      revalidate: 3600,
      tags: ["orders"],
    }
  )()
}

export async function getOrdersForExport() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            id: orders.id,
            orderNumber: orders.orderNumber,
            userName: users.name,
            userEmail: users.email,
            status: orders.status,
            totalAmount: orders.totalAmount,
            currency: orders.currency,
            paymentMethod: orders.paymentMethod,
            paymentStatus: orders.paymentStatus,
            createdAt: orders.createdAt,
          })
          .from(orders)
          .leftJoin(users, eq(orders.userId, users.id))
          .orderBy(desc(orders.createdAt))

        return data
      } catch (err) {
        return []
      }
    },
    ["orders-export"],
    {
      revalidate: 3600,
      tags: ["orders"],
    }
  )()
}

export async function getOrdersAnalytics() {
  return await unstable_cache(
    async () => {
      try {
        const totalOrders = await db
          .select({ count: count() })
          .from(orders)
          .then((res) => res[0]?.count ?? 0)

        const totalRevenue = await db
          .select({ 
            total: sum(orders.totalAmount)
          })
          .from(orders)
          .where(eq(orders.paymentStatus, "paid"))
          .then((res) => res[0]?.total ?? "0")

        const completedOrders = await db
          .select({ count: count() })
          .from(orders)
          .where(eq(orders.status, "completed"))
          .then((res) => res[0]?.count ?? 0)

        const pendingOrders = await db
          .select({ count: count() })
          .from(orders)
          .where(eq(orders.status, "pending"))
          .then((res) => res[0]?.count ?? 0)

        return {
          totalOrders,
          totalRevenue: parseFloat(totalRevenue),
          completedOrders,
          pendingOrders,
        }
      } catch (err) {
        return {
          totalOrders: 0,
          totalRevenue: 0,
          completedOrders: 0,
          pendingOrders: 0,
        }
      }
    },
    ["orders-analytics"],
    {
      revalidate: 3600,
      tags: ["orders"],
    }
  )()
}
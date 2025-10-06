// This file will contain query functions for the admin dashboard.
// For example, fetching total revenue, product counts, order counts, etc.

import { db } from "@/lib/db";
import { products, orders, users, orderItems } from "@/lib/db/schema";
import { unstable_cache as cache } from "next/cache";
import { and, count, desc, eq, gte, sql, sum } from "drizzle-orm";
import { format } from "date-fns";

export async function getDashboardAnalytics() {
  return await cache(
    async () => {
      try {
        console.log({ dashboardAnalytics: "Fetching from DB" });

        const totalRevenuePromise = db
          .select({
            // Sum of paid order items' total price
            total: sum(orderItems.totalPrice).mapWith(Number),
          })
          .from(orderItems)
          .leftJoin(orders, eq(orders.id, orderItems.orderId))
          // Revenue should be based on paid orders
          .where(eq(orders.paymentStatus, "paid"));

        const totalProductsPromise = db
          .select({ total: count().mapWith(Number) }) // Ensure number
          .from(products);

        const totalOrdersPromise = db
          .select({ total: count().mapWith(Number) })
          .from(orders); // Ensure number

        const totalUsersPromise = db
          .select({ total: count().mapWith(Number) })
          .from(users); // Ensure number

        // Fetch sales data for the last 30 days for the overview chart
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const overviewDataPromise = db
          .select({
            date: sql<string>`DATE_TRUNC('day', ${orders.createdAt})`.mapWith((val) =>
              format(new Date(val), "yyyy-MM-dd"),
            ),
            totalSales: sum(orderItems.totalPrice).mapWith(Number),
          })
          .from(orders)
          .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
          .where(and(gte(orders.createdAt, thirtyDaysAgo), eq(orders.paymentStatus, "paid")))
          .groupBy(sql`DATE_TRUNC('day', ${orders.createdAt})`)
          .orderBy(sql`DATE_TRUNC('day', ${orders.createdAt})`);

        // Fetch recent sales (e.g., last 5 orders with customer info)
        const recentSalesPromise = db
          .select({
            id: orders.id,
            customerEmail: users.email,
            customerName: users.name,
            customerImage: users.avatar,
            amount: orders.totalAmount, // Select the column directly
            createdAt: orders.createdAt,
          })
          .from(orders)
          .leftJoin(users, eq(orders.userId, users.id))
          .orderBy(desc(orders.createdAt))
          .limit(5);

        const [
          totalRevenueResult,
          totalProductsResult,
          totalOrdersResult,
          totalUsersResult,
          overviewData,
          recentSales,
        ] = await Promise.all([
          totalRevenuePromise,
          totalProductsPromise,
          totalOrdersPromise,
          totalUsersPromise,
          overviewDataPromise,
          recentSalesPromise,
        ]);

        return {
          totalRevenue: totalRevenueResult[0]?.total ?? 0,
          totalProducts: totalProductsResult[0]?.total ?? 0,
          totalOrders: totalOrdersResult[0]?.total ?? 0,
          totalUsers: totalUsersResult[0]?.total ?? 0,
          overviewData: overviewData.map((d) => {
            let name = "Unknown Date";
            try {
              const dateObj = new Date(d.date);
              if (!isNaN(dateObj.getTime())) {
                name = format(dateObj, "MMM d");
              } else {
                console.warn(`Invalid date string encountered in overviewData: ${d.date}`);
              }
            } catch (e) {
              console.error(`Error formatting date in overviewData: ${d.date}`, e);
            }
            return { name, total: d.totalSales ?? 0 };
          }),
          recentSales: recentSales.map((sale) => {
            let formattedDate = "Unknown Date";
            try {
              if (sale.createdAt && !isNaN(new Date(sale.createdAt).getTime())) {
                formattedDate = format(new Date(sale.createdAt), "PPpp");
              } else {
                console.warn(`Invalid createdAt date encountered in recentSales: ${sale.createdAt}`);
              }
            } catch (e) {
              console.error(`Error formatting createdAt date in recentSales: ${sale.createdAt}`, e);
            }
            return {
              id: sale.id,
              name: sale.customerName ?? "Unknown User",
              email: sale.customerEmail ?? "",
              avatar: sale.customerImage ?? "/placeholder.svg",
              amount: Number(sale.amount ?? 0),
              createdAt: formattedDate,
            };
          }),
        };
      } catch (error) {
        console.error("getDashboardAnalytics error:", error);
        // Return safe defaults so the UI can still render without throwing
        return {
          totalRevenue: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalUsers: 0,
          overviewData: [],
          recentSales: [],
        };
      }
    },
    ["dashboardAnalytics"],
    {
      revalidate: 60 * 5, // Revalidate every 5 minutes
      tags: ["dashboardAnalytics"],
    },
  )();
}
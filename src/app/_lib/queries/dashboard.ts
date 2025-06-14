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
      console.log({dashboardAnalytics: "Fetching from DB"});

      const totalRevenuePromise = db
        .select({
          total: sum(orderItems.price).mapWith(Number), // Ensure number
        })
        .from(orderItems)
        .leftJoin(orders, eq(orders.id, orderItems.orderId))
        .where(eq(orders.status, "paid")); // Assuming 'paid' status means revenue

      const totalProductsPromise = db
        .select({ total: count().mapWith(Number) }) // Ensure number
        .from(products);

      const totalOrdersPromise = db.select({ total: count().mapWith(Number) }).from(orders); // Ensure number

      const totalUsersPromise = db.select({ total: count().mapWith(Number) }).from(users); // Ensure number

      // Fetch sales data for the last 30 days for the overview chart
      // This needs to be adapted based on how sales/orders are structured
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const overviewDataPromise = db
        .select({
          date: sql<string>`DATE_TRUNC('day', ${orders.createdAt})`.mapWith(
            (val) => format(new Date(val), "yyyy-MM-dd"),
          ),
          totalSales: sum(orderItems.price).mapWith(Number),
        })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .where(
          and(
            gte(orders.createdAt, thirtyDaysAgo),
            eq(orders.status, "paid"),
          ),
        )
        .groupBy(sql`DATE_TRUNC('day', ${orders.createdAt})`)
        .orderBy(sql`DATE_TRUNC('day', ${orders.createdAt})`);

      // Fetch recent sales (e.g., last 5 orders with customer info)
      const recentSalesPromise = db
        .select({
          id: orders.id,
          customerEmail: users.email,
          customerName: users.name,
          customerImage: users.image,
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
        overviewData: overviewData.map(d => {
          let name = "Unknown Date";
          try {
            // Ensure d.date is a valid string representation of a date
            // The DATE_TRUNC should return a string like 'YYYY-MM-DD HH:MM:SS+ZZ'
            // or just 'YYYY-MM-DD' if time is truncated. new Date() should handle this.
            const dateObj = new Date(d.date);
            if (!isNaN(dateObj.getTime())) { // Check if dateObj is a valid date
              name = format(dateObj, "MMM d");
            } else {
              console.warn(`Invalid date string encountered in overviewData: ${d.date}`);
            }
          } catch (e) {
            console.error(`Error formatting date in overviewData: ${d.date}`, e);
          }
          return { name, total: d.totalSales ?? 0 };
        }),
        recentSales: recentSales.map(sale => {
          let formattedDate = "Unknown Date";
          try {
            if (sale.createdAt && !isNaN(new Date(sale.createdAt).getTime())) {
              formattedDate = format(new Date(sale.createdAt), "PPpp"); // Format to a readable string
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
            avatar: sale.customerImage ?? "/placeholder.svg", // Provide a default placeholder
            amount: Number(sale.amount ?? 0), // Ensure number
            createdAt: formattedDate, // Use the formatted date string
          };
        }),
      };
    },
    ["dashboardAnalytics"],
    {
      revalidate: 60 * 5, // Revalidate every 5 minutes
      tags: ["dashboardAnalytics"],
    },
  )();
}
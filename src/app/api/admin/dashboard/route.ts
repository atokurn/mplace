import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, users, downloads, reviews } from '@/lib/db/schema';
import { sql, count, sum, avg, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total counts
    const [totalProducts] = await db.select({ count: count() }).from(products);
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalDownloads] = await db.select({ count: count() }).from(downloads);
    
    // Get total revenue (sum of all product prices * download count)
    const revenueResult = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CAST(${products.price} AS DECIMAL) * ${products.downloadCount}), 0)`
      })
      .from(products);
    
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    
    // Get recent downloads with user and product info
    const recentDownloads = await db
      .select({
        id: downloads.id,
        customerName: users.name,
        customerEmail: users.email,
        productTitle: products.title,
        productPrice: products.price,
        downloadedAt: downloads.downloadedAt,
      })
      .from(downloads)
      .innerJoin(users, sql`${downloads.userId} = ${users.id}`)
      .innerJoin(products, sql`${downloads.productId} = ${products.id}`)
      .orderBy(desc(downloads.downloadedAt))
      .limit(10);
    
    // Get top products by download count
    const topProducts = await db
      .select({
        id: products.id,
        title: products.title,
        downloadCount: products.downloadCount,
        price: products.price,
        revenue: sql<number>`CAST(${products.price} AS DECIMAL) * ${products.downloadCount}`,
        category: products.category,
      })
      .from(products)
      .orderBy(desc(products.downloadCount))
      .limit(5);
    
    // Get average rating
    const [avgRating] = await db
      .select({
        avgRating: avg(reviews.rating)
      })
      .from(reviews);
    
    // Calculate monthly growth (mock for now - would need date comparison)
    const monthlyGrowth = 12.5; // This would require more complex date calculations
    
    // Calculate conversion rate (downloads / users)
    const conversionRate = totalUsers.count > 0 
      ? (totalDownloads.count / totalUsers.count) * 100 
      : 0;
    
    const stats = {
      totalProducts: totalProducts.count,
      totalUsers: totalUsers.count,
      totalDownloads: totalDownloads.count,
      totalRevenue: Number(totalRevenue),
      monthlyGrowth,
      conversionRate: Number(conversionRate.toFixed(2)),
      averageRating: Number(avgRating.avgRating || 0)
    };
    
    return NextResponse.json({
      stats,
      recentDownloads,
      topProducts
    });
    
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
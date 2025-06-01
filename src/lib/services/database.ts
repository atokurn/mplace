import { db } from '@/lib/db';
import { users, products, reviews, downloads } from '@/lib/db/schema';
import { eq, desc, count, and, sql } from 'drizzle-orm';
import type { User, Product, Review, NewUser, NewProduct, NewReview } from '@/lib/db/schema';

// User services
export const userService = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  },

  async findById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return result[0] || null;
  },

  async create(userData: NewUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .returning();
    
    return result[0];
  },

  async update(id: string, userData: Partial<NewUser>): Promise<User> {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  },

  async getAll(limit = 50, offset = 0) {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
  },
};

// Product services
export const productService = {
  async findById(id: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.isActive, true)))
      .limit(1);
    
    return result[0] || null;
  },

  async create(productData: NewProduct): Promise<Product> {
    const result = await db
      .insert(products)
      .values(productData)
      .returning();
    
    return result[0];
  },

  async update(id: string, productData: Partial<NewProduct>): Promise<Product> {
    const result = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    
    return result[0];
  },

  async delete(id: string): Promise<void> {
    await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));
  },

  async incrementDownloadCount(id: string): Promise<void> {
    await db
      .update(products)
      .set({ 
        downloadCount: sql`${products.downloadCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(products.id, id));
  },

  async getPopular(limit = 10) {
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.downloadCount))
      .limit(limit);
  },

  async getRecent(limit = 10) {
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  },

  async getByCategory(category: string, limit = 20, offset = 0) {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.category, category),
        eq(products.isActive, true)
      ))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  },
};

// Review services
export const reviewService = {
  async create(reviewData: NewReview): Promise<Review> {
    const result = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    
    return result[0];
  },

  async getByProductId(productId: string, limit = 10, offset = 0) {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async getAverageRating(productId: string): Promise<number> {
    const result = await db
      .select({ 
        avg: sql<number>`AVG(${reviews.rating})::numeric(3,2)` 
      })
      .from(reviews)
      .where(eq(reviews.productId, productId));
    
    return Number(result[0]?.avg) || 0;
  },
};

// Download services
export const downloadService = {
  async recordDownload(productId: string, userId: string) {
    await db.insert(downloads).values({
      productId,
      userId,
    });
    
    // Increment download count
    await productService.incrementDownloadCount(productId);
  },

  async getUserDownloads(userId: string, limit = 20, offset = 0) {
    return await db
      .select({
        id: downloads.id,
        downloadedAt: downloads.downloadedAt,
        product: {
          id: products.id,
          title: products.title,
          imageUrl: products.imageUrl,
          fileUrl: products.fileUrl,
        },
      })
      .from(downloads)
      .leftJoin(products, eq(downloads.productId, products.id))
      .where(eq(downloads.userId, userId))
      .orderBy(desc(downloads.downloadedAt))
      .limit(limit)
      .offset(offset);
  },

  async hasUserDownloaded(productId: string, userId: string): Promise<boolean> {
    const result = await db
      .select({ id: downloads.id })
      .from(downloads)
      .where(and(
        eq(downloads.productId, productId),
        eq(downloads.userId, userId)
      ))
      .limit(1);
    
    return result.length > 0;
  },
};

// Analytics services
export const analyticsService = {
  async getDashboardStats() {
    const [totalProducts] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));

    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    const [totalDownloads] = await db
      .select({ count: count() })
      .from(downloads);

    const [totalReviews] = await db
      .select({ count: count() })
      .from(reviews);

    return {
      totalProducts: totalProducts.count,
      totalUsers: totalUsers.count,
      totalDownloads: totalDownloads.count,
      totalReviews: totalReviews.count,
    };
  },

  async getPopularCategories(limit = 5) {
    return await db
      .select({
        category: products.category,
        count: count(),
      })
      .from(products)
      .where(eq(products.isActive, true))
      .groupBy(products.category)
      .orderBy(desc(count()))
      .limit(limit);
  },
};
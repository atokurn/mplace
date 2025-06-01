import { pgTable, text, timestamp, uuid, decimal, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'), // 'user' | 'admin'
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  category: text('category').notNull(), // Keep for backward compatibility
  tags: jsonb('tags').$type<string[]>().default([]),
  imageUrl: text('image_url').notNull(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  downloadCount: integer('download_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Downloads table (track user downloads)
export const downloads = pgTable('downloads', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  paymentMethod: text('payment_method'), // 'stripe' | 'paypal' | 'crypto'
  paymentStatus: text('payment_status').notNull().default('pending'), // 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId: text('payment_id'), // External payment provider ID
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order Items table (products in each order)
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Promotions table
export const promotions = pgTable('promotions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // 'percentage' | 'fixed_amount' | 'free_shipping'
  value: decimal('value', { precision: 10, scale: 2 }).notNull(), // Percentage (0-100) or fixed amount
  minimumOrderAmount: decimal('minimum_order_amount', { precision: 10, scale: 2 }),
  maxUsageCount: integer('max_usage_count'), // null = unlimited
  currentUsageCount: integer('current_usage_count').default(0).notNull(),
  maxUsagePerUser: integer('max_usage_per_user').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startsAt: timestamp('starts_at').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  applicableProducts: jsonb('applicable_products').$type<string[]>(), // Product IDs, null = all products
  applicableCategories: jsonb('applicable_categories').$type<string[]>(), // Category IDs, null = all categories
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Promotion Usage table (track who used which promotion)
export const promotionUsage = pgTable('promotion_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  promotionId: uuid('promotion_id').references(() => promotions.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp('used_at').defaultNow().notNull(),
});

// Analytics Events table (for tracking user behavior)
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: text('event_type').notNull(), // 'page_view' | 'product_view' | 'download' | 'purchase' | 'search'
  userId: uuid('user_id').references(() => users.id), // null for anonymous users
  sessionId: text('session_id'),
  productId: uuid('product_id').references(() => products.id), // for product-related events
  orderId: uuid('order_id').references(() => orders.id), // for purchase events
  metadata: jsonb('metadata'), // Additional event data
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  referrer: text('referrer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Settings table (for admin configuration)
export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  category: text('category').notNull().default('general'), // 'general' | 'payment' | 'email' | 'storage'
  isPublic: boolean('is_public').default(false).notNull(), // Can be accessed by frontend
  updatedBy: uuid('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

export const insertProductSchema = createInsertSchema(products, {
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  category: z.string().min(1),
});
export const selectProductSchema = createSelectSchema(products);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SelectProduct = z.infer<typeof selectProductSchema>;

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});
export const selectReviewSchema = createSelectSchema(reviews);
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type SelectReview = z.infer<typeof selectReviewSchema>;

export const insertDownloadSchema = createInsertSchema(downloads);
export const selectDownloadSchema = createSelectSchema(downloads);
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type SelectDownload = z.infer<typeof selectDownloadSchema>;

// Categories schemas
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(1),
  slug: z.string().min(1),
});
export const selectCategorySchema = createSelectSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type SelectCategory = z.infer<typeof selectCategorySchema>;

// Orders schemas
export const insertOrderSchema = createInsertSchema(orders, {
  orderNumber: z.string().min(1),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
});
export const selectOrderSchema = createSelectSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SelectOrder = z.infer<typeof selectOrderSchema>;

// Order Items schemas
export const insertOrderItemSchema = createInsertSchema(orderItems, {
  quantity: z.number().min(1),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
});
export const selectOrderItemSchema = createSelectSchema(orderItems);
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type SelectOrderItem = z.infer<typeof selectOrderItemSchema>;

// Promotions schemas
export const insertPromotionSchema = createInsertSchema(promotions, {
  title: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(['percentage', 'fixed_amount', 'free_shipping']),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/),
});
export const selectPromotionSchema = createSelectSchema(promotions);
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type SelectPromotion = z.infer<typeof selectPromotionSchema>;

// Promotion Usage schemas
export const insertPromotionUsageSchema = createInsertSchema(promotionUsage, {
  discountAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
});
export const selectPromotionUsageSchema = createSelectSchema(promotionUsage);
export type InsertPromotionUsage = z.infer<typeof insertPromotionUsageSchema>;
export type SelectPromotionUsage = z.infer<typeof selectPromotionUsageSchema>;

// Analytics Events schemas
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents, {
  eventType: z.enum(['page_view', 'product_view', 'download', 'purchase', 'search']),
});
export const selectAnalyticsEventSchema = createSelectSchema(analyticsEvents);
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type SelectAnalyticsEvent = z.infer<typeof selectAnalyticsEventSchema>;

// Settings schemas
export const insertSettingSchema = createInsertSchema(settings, {
  key: z.string().min(1),
  category: z.enum(['general', 'payment', 'email', 'storage']),
});
export const selectSettingSchema = createSelectSchema(settings);
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type SelectSetting = z.infer<typeof selectSettingSchema>;

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Download = typeof downloads.$inferSelect;
export type NewDownload = typeof downloads.$inferInsert;
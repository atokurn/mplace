import { pgTable, text, timestamp, uuid, decimal, integer, boolean, jsonb, foreignKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';

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
  shortDescription: text('short_description'), // Brief product summary
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }), // For discount display
  // commercialPrice removed
  categoryId: uuid('category_id').references(() => categories.id),
  category: text('category').notNull(), // Keep for backward compatibility
  tags: jsonb('tags').$type<string[]>().default([]),
  
  // Media fields
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'), // Optimized thumbnail
  previewImages: jsonb('preview_images').$type<string[]>().default([]), // Additional preview images
  

  // Physical product fields
  isPhysical: boolean('is_physical').default(true).notNull(),
  requiresShipping: boolean('requires_shipping').default(true).notNull(),
  weightGrams: integer('weight_grams'), // in grams
  lengthCm: decimal('length_cm', { precision: 10, scale: 2 }),
  widthCm: decimal('width_cm', { precision: 10, scale: 2 }),
  heightCm: decimal('height_cm', { precision: 10, scale: 2 }),
  brand: text('brand'),
  barcode: text('barcode'),
  material: text('material'),
  
  // SEO and marketing
  slug: text('slug').notNull().unique().default(''),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  keywords: jsonb('keywords').$type<string[]>().default([]),
  
  // Shipping & sales settings (added to reflect frontend form)
  shippingMode: text('shipping_mode').notNull().default('default'), // 'default' | 'custom'
  codEnabled: boolean('cod_enabled').default(false).notNull(),
  shippingInsuranceEnabled: boolean('shipping_insurance_enabled').default(false).notNull(),
  shippingInsuranceRequired: boolean('shipping_insurance_required').default(false).notNull(),
  skuMappingEnabled: boolean('sku_mapping_enabled').default(false).notNull(),
  
  // Pre-order (product level)
  preOrderEnabled: boolean('pre_order_enabled').default(false).notNull(),
  preOrderLeadTimeDays: integer('pre_order_lead_time_days').default(0).notNull(),
  
  // Statistics and status
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'), // Average rating
  reviewCount: integer('review_count').default(0).notNull(),
  
  // Product status
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isNew: boolean('is_new').default(true).notNull(),
  isBestseller: boolean('is_bestseller').default(false).notNull(),
  
  // Timestamps
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
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



// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  slug: text('slug').notNull().unique().default(''),
  imageUrl: text('image_url'),
  parentId: uuid('parent_id'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  foreignKey({
    columns: [t.parentId],
    foreignColumns: [t.id],
  }).onDelete('set null'),
]);

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
  eventType: text('event_type').notNull(), // 'page_view' | 'product_view' | 'add_to_cart' | 'purchase' | 'search'
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
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(300, 'Short description must be less than 300 characters').optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid original price format').optional(),
  // commercialPrice validation removed
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  
  // Media validation
  imageUrl: z.string().url('Invalid image URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  previewImages: z.array(z.string().url()).default([]),

  // Physical product validation
  isPhysical: z.literal(true),
  requiresShipping: z.literal(true),
  weightGrams: z.number().int().positive('Weight must be a positive integer').optional(),
  lengthCm: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid length').optional(),
  widthCm: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid width').optional(),
  heightCm: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid height').optional(),
  brand: z.string().max(100).optional(),
  barcode: z.string().max(64).optional(),
  material: z.string().max(100).optional(),
  
  // SEO fields
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  keywords: z.array(z.string()).default([]),

  // Shipping & sales settings
  shippingMode: z.enum(['default', 'custom']).default('default'),
  codEnabled: z.boolean().default(false),
  shippingInsuranceEnabled: z.boolean().default(false),
  shippingInsuranceRequired: z.boolean().default(false),
  skuMappingEnabled: z.boolean().default(false),

  // Pre-order settings
  preOrderEnabled: z.boolean().default(false),
  preOrderLeadTimeDays: z.number().int().min(0).default(0),
  
  // Status fields
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
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
  eventType: z.enum(['page_view', 'product_view', 'add_to_cart', 'purchase', 'search']),
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

// Product Variants table
export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  sku: text('sku').notNull().unique(),
  title: text('title'),
  price: decimal('price', { precision: 10, scale: 2 }),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  attributes: jsonb('attributes').$type<Record<string, string>>(),
  // Per-variant media and shipping
  imageUrl: text('image_url'),
  barcode: text('barcode'),
  packageWeightGrams: integer('package_weight_grams'),
  weightUnit: text('weight_unit').default('g').notNull(), // 'g' | 'kg'
  packageLengthCm: decimal('package_length_cm', { precision: 10, scale: 2 }),
  packageWidthCm: decimal('package_width_cm', { precision: 10, scale: 2 }),
  packageHeightCm: decimal('package_height_cm', { precision: 10, scale: 2 }),
  // Pre-order (variant level)
  preOrderEnabled: boolean('pre_order_enabled').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inventory table (per variant or product)
export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id),
  variantId: uuid('variant_id').references(() => productVariants.id),
  stock: integer('stock').notNull().default(0),
  reserved: integer('reserved').notNull().default(0),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Address book for users
export const addresses = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  company: text('company'),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state'),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Carts
export const carts = pgTable('carts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  sessionId: text('session_id'),
  currency: text('currency').notNull().default('USD'),
  subtotalAmount: decimal('subtotal_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  shippingAmount: decimal('shipping_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  status: text('status').notNull().default('active'), // 'active' | 'abandoned' | 'converted'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cart Items
export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  cartId: uuid('cart_id').references(() => carts.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  variantId: uuid('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Order Addresses snapshot (billing/shipping captured at checkout)
export const orderAddresses = pgTable('order_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  type: text('type').notNull().default('shipping'), // 'shipping' | 'billing'
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  company: text('company'),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state'),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Shipments
export const shipments = pgTable('shipments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  provider: text('provider'),
  service: text('service'),
  trackingNumber: text('tracking_number'),
  status: text('status').notNull().default('pending'), // 'pending' | 'created' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled'
  cost: decimal('cost', { precision: 10, scale: 2 }).notNull().default('0.00'),
  currency: text('currency').notNull().default('USD'),
  estimatedDays: integer('estimated_days'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shipmentItems = pgTable('shipment_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  shipmentId: uuid('shipment_id').references(() => shipments.id).notNull(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id).notNull(),
  quantity: integer('quantity').notNull().default(1),
});

// Tax rates
export const taxRates = pgTable('tax_rates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  country: text('country'),
  region: text('region'),
  rate: decimal('rate', { precision: 7, scale: 4 }).notNull(), // e.g., 0.1000 = 10%
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for new tables
export const productVariantOptions = pgTable('product_variant_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  name: text('name').notNull(), // e.g., "Color", "Size"
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariantOptionValues = pgTable('product_variant_option_values', {
  id: uuid('id').defaultRandom().primaryKey(),
  optionId: uuid('option_id').references(() => productVariantOptions.id).notNull(),
  value: text('value').notNull(), // e.g., "Red", "XL"
  imageUrl: text('image_url'), // optional swatch/image per value
  colorCode: text('color_code'), // optional hex color for swatch
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariantSelections = pgTable('product_variant_selections', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').references(() => productVariants.id).notNull(),
  optionId: uuid('option_id').references(() => productVariantOptions.id).notNull(),
  optionValueId: uuid('option_value_id').references(() => productVariantOptionValues.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertInventorySchema = createInsertSchema(inventory, {
  stock: z.number().min(0),
  reserved: z.number().min(0),
  lowStockThreshold: z.number().min(0),
});
export const selectInventorySchema = createSelectSchema(inventory);
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type SelectInventory = z.infer<typeof selectInventorySchema>;

export const insertAddressSchema = createInsertSchema(addresses, {
  fullName: z.string().min(1),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});
export const selectAddressSchema = createSelectSchema(addresses);
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type SelectAddress = z.infer<typeof selectAddressSchema>;

export const insertCartSchema = createInsertSchema(carts, {
  currency: z.string().min(1),
  subtotalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  discountAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  taxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  shippingAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  status: z.enum(['active', 'abandoned', 'converted']).default('active'),
});
export const selectCartSchema = createSelectSchema(carts);
export type InsertCart = z.infer<typeof insertCartSchema>;
export type SelectCart = z.infer<typeof selectCartSchema>;

export const insertCartItemSchema = createInsertSchema(cartItems, {
  quantity: z.number().min(1),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
});
export const selectCartItemSchema = createSelectSchema(cartItems);
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type SelectCartItem = z.infer<typeof selectCartItemSchema>;

export const insertOrderAddressSchema = createInsertSchema(orderAddresses, {
  type: z.enum(['shipping', 'billing']).default('shipping'),
  fullName: z.string().min(1),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});
export const selectOrderAddressSchema = createSelectSchema(orderAddresses);
export type InsertOrderAddress = z.infer<typeof insertOrderAddressSchema>;
export type SelectOrderAddress = z.infer<typeof selectOrderAddressSchema>;

export const insertShipmentSchema = createInsertSchema(shipments, {
  status: z.enum(['pending', 'created', 'shipped', 'in_transit', 'delivered', 'cancelled']).default('pending'),
  cost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  currency: z.string().min(1),
});
export const selectShipmentSchema = createSelectSchema(shipments);
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type SelectShipment = z.infer<typeof selectShipmentSchema>;

export const insertShipmentItemSchema = createInsertSchema(shipmentItems, {
  quantity: z.number().min(1),
});
export const selectShipmentItemSchema = createSelectSchema(shipmentItems);
export type InsertShipmentItem = z.infer<typeof insertShipmentItemSchema>;
export type SelectShipmentItem = z.infer<typeof selectShipmentItemSchema>;

export const insertTaxRateSchema = createInsertSchema(taxRates, {
  name: z.string().min(1),
  rate: z.string().regex(/^\d+(\.\d{1,4})?$/, 'Invalid tax rate'),
});
export const selectTaxRateSchema = createSelectSchema(taxRates);
export type InsertTaxRate = z.infer<typeof insertTaxRateSchema>;
export type SelectTaxRate = z.infer<typeof selectTaxRateSchema>;

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
// removed: export type Download/NewDownload (downloads table removed)
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
export type OrderAddress = typeof orderAddresses.$inferSelect;
export type NewOrderAddress = typeof orderAddresses.$inferInsert;
export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
export type ShipmentItem = typeof shipmentItems.$inferSelect;
export type NewShipmentItem = typeof shipmentItems.$inferInsert;
export type TaxRate = typeof taxRates.$inferSelect;
export type NewTaxRate = typeof taxRates.$inferInsert;
export const insertProductVariantSchema = createInsertSchema(productVariants, {
  sku: z.string().min(1, 'SKU is required'),
  title: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional(),
  compareAtPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid compare-at price format').optional(),
  attributes: z.record(z.string()).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  barcode: z.string().max(64).optional(),
  packageWeightGrams: z.number().int().min(0, 'Weight must be a non-negative integer').optional(),
  weightUnit: z.enum(['g', 'kg']).default('g'),
  packageLengthCm: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid package length').optional(),
  packageWidthCm: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid package width').optional(),
  packageHeightCm: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid package height').optional(),
  preOrderEnabled: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export const selectProductVariantSchema = createSelectSchema(productVariants);
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type SelectProductVariant = z.infer<typeof selectProductVariantSchema>;
export const insertProductVariantOptionSchema = createInsertSchema(productVariantOptions, {
  name: z.string().min(1, 'Option name is required'),
  position: z.number().int().min(0).default(0),
});
export const selectProductVariantOptionSchema = createSelectSchema(productVariantOptions);
export type InsertProductVariantOption = z.infer<typeof insertProductVariantOptionSchema>;
export type SelectProductVariantOption = z.infer<typeof selectProductVariantOptionSchema>;
export const insertProductVariantOptionValueSchema = createInsertSchema(productVariantOptionValues, {
  value: z.string().min(1, 'Option value is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  colorCode: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color')
    .optional(),
  position: z.number().int().min(0).default(0),
});
export const selectProductVariantOptionValueSchema = createSelectSchema(productVariantOptionValues);
export type InsertProductVariantOptionValue = z.infer<typeof insertProductVariantOptionValueSchema>;
export type SelectProductVariantOptionValue = z.infer<typeof selectProductVariantOptionValueSchema>;
export const insertProductVariantSelectionSchema = createInsertSchema(productVariantSelections, {
  variantId: z.string().uuid('Invalid variant id'),
  optionId: z.string().uuid('Invalid option id'),
  optionValueId: z.string().uuid('Invalid option value id'),
});export const selectProductVariantSelectionSchema = createSelectSchema(productVariantSelections);
export type InsertProductVariantSelection = z.infer<typeof insertProductVariantSelectionSchema>;
export type SelectProductVariantSelection = z.infer<typeof selectProductVariantSelectionSchema>;
export type ProductVariantOption = typeof productVariantOptions.$inferSelect;
export type NewProductVariantOption = typeof productVariantOptions.$inferInsert;
export type ProductVariantOptionValue = typeof productVariantOptionValues.$inferSelect;
export type NewProductVariantOptionValue = typeof productVariantOptionValues.$inferInsert;
export type ProductVariantSelection = typeof productVariantSelections.$inferSelect;
export type NewProductVariantSelection = typeof productVariantSelections.$inferInsert;
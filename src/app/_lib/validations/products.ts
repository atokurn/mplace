import { z } from "zod";

// Search params type for products
export type GetProductsSchema = {
  page: number;
  perPage: number;
  sort?: string;
  title?: string;
  category?: string | string[];
  price?: string[];
  status?: string[];
  isActive?: string[];
  tags?: string[];
  filters?: Array<{
    id: string;
    value: unknown;
    operator?: string;
  }>;
  joinOperator?: 'and' | 'or';
  filterFlag?: string;
  operator?: 'and' | 'or';
};

export const createProductSchema = z.object({
  // Core product information
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  shortDescription: z.string().max(300, "Short description must be less than 300 characters").optional(),
  
  // Pricing
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid original price").optional(),
  // removed commercialPrice
  
  // Category and classification
  categoryId: z.string().uuid("Invalid category ID").optional().nullable(),
  category: z.string().min(1, "Category is required").max(100, "Category must be less than 100 characters"),
  tags: z.array(z.string()).default([]),
  
  // Media files
  imageUrl: z.string().url("Invalid image URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  previewImages: z.array(z.string().url("Invalid preview image URL")).default([]),
  
  // Physical product fields (digital-only fields removed)
  isPhysical: z.boolean().default(true),
  requiresShipping: z.boolean().default(true),
  weightGrams: z.number().int().positive().optional(),
  lengthCm: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid length").optional(),
  widthCm: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid width").optional(),
  heightCm: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid height").optional(),
  brand: z.string().max(100).optional(),
  barcode: z.string().max(64).optional(),
  material: z.string().max(100).optional(),
  
  // SEO fields
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  metaTitle: z.string().max(60, "Meta title must be less than 60 characters").optional(),
  metaDescription: z.string().max(160, "Meta description must be less than 160 characters").optional(),
  keywords: z.array(z.string()).default([]),
  
  // Status and flags
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  isBestseller: z.boolean().optional().default(false),
  
  // removed Licensing (licenseType, usageRights)
  
  // Publishing
  publishedAt: z.date().optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid("Invalid product ID"),
});

export const deleteProductsSchema = z.object({
  ids: z.array(z.string().uuid("Invalid product ID")),
});

export const updateProductsSchema = z.object({
  ids: z.array(z.string().uuid("Invalid product ID")),
  isActive: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  category: z.string().optional(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type DeleteProductsSchema = z.infer<typeof deleteProductsSchema>;
export type UpdateProductsSchema = z.infer<typeof updateProductsSchema>;
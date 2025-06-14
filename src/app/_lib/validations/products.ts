"use server";
import { z } from "zod";
import { insertProductSchema } from "@/lib/db/schema";

// Search params type for products
export type GetProductsSchema = {
  page?: number;
  perPage?: number;
  sort?: string;
  title?: string;
  category?: string | string[];
  price?: string[];
  status?: string[];
  isActive?: string[];
  filters?: Array<{
    id: string;
    value: any;
    operator?: string;
  }>;
  joinOperator?: 'and' | 'or';
  filterFlag?: string;
  operator?: 'and' | 'or';
};

export const createProductSchema = insertProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  downloadCount: true,
  viewCount: true,
  likeCount: true,
  reviewCount: true,
  rating: true,
}).extend({
  // Core product information
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  shortDescription: z.string().max(300, "Short description must be less than 300 characters").optional(),
  
  // Pricing
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  originalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid original price").optional(),
  
  // Category and classification
  categoryId: z.string().uuid("Invalid category ID").optional().nullable(),
  category: z.string().min(1, "Category is required").max(100, "Category must be less than 100 characters"),
  tags: z.array(z.string()).default([]),
  
  // Media files
  imageUrl: z.string().url("Invalid image URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  previewImages: z.array(z.string().url("Invalid preview image URL")).default([]),
  
  // Product files
  fileUrl: z.string().url("Invalid file URL"),
  fileName: z.string().min(1, "File name is required").max(255, "File name must be less than 255 characters"),
  fileSize: z.number().min(1, "File size must be greater than 0"),
  fileFormat: z.string().min(1, "File format is required"),
  fileType: z.enum(['digital', 'template', 'font', 'vector']).default('digital'),
  
  // Product specifications
  dimensions: z.string().optional(),
  resolution: z.string().optional(),
  colorMode: z.string().optional(),
  software: z.array(z.string()).default([]),
  
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
  
  // Licensing
  licenseType: z.enum(['standard', 'extended', 'commercial']).default('standard'),
  usageRights: z.array(z.string()).default([]),
  
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
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type DeleteProductsSchema = z.infer<typeof deleteProductsSchema>;
export type UpdateProductsSchema = z.infer<typeof updateProductsSchema>;
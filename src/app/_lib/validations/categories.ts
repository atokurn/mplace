import { insertCategorySchema } from "@/lib/db/schema";
import { z } from "zod";

// Search params type for categories
export type GetCategoriesSchema = {
  page?: number;
  per_page?: number;
  sort?: string;
  name?: string;
  isActive?: string[];
  description?: string;
  filters?: Array<{
    id: string;
    value: any;
    operator?: string;
  }>;
  joinOperator?: 'and' | 'or';
  filterFlag?: string;
};

export const createCategorySchema = insertCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  slug: z.string().max(100, "Slug must be less than 100 characters").regex(/^[a-z0-9-]*$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

export const deleteCategorySchema = z.object({
  id: z.string(),
});

export const deleteCategoriesSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one category must be selected"),
});

export const updateCategoriesSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one category must be selected"),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});
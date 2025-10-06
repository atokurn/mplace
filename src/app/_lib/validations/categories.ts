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
    value: unknown;
    operator?: string;
  }>;
  joinOperator?: 'and' | 'or';
  filterFlag?: string;
};

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  slug: z.string().max(100, "Slug must be less than 100 characters").regex(/^[a-z0-9-]*$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  // Allow absolute URLs (http/https) or project-relative paths like /uploads/..., /images/..., /static/...
  imageUrl: z.union([
    z.string().url("Invalid image URL"),
    z.string().regex(/^\/(uploads|images|static)\/.+$/, "Invalid image URL"),
    z.literal("")
  ]).optional(),
  parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

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
import * as z from "zod";

export const getProductsSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  isActive: z.array(z.string()).optional(), // Array of 'true' or 'false'
  filterFlag: z.enum(["basicFilters", "advancedFilters", "commandFilters"]).optional(),
  filters: z
    .array(
      z.object({
        id: z.string(),
        value: z.any(),
        operator: z.string().optional(),
      }),
    )
    .optional(),
  joinOperator: z.enum(["and", "or"]).optional(),
});

export type GetProductsSchema = z.infer<typeof getProductsSchema>;

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  categoryId: z.string().min(1, "Category is required."),
  category: z.string().optional(), // This might be redundant if categoryId is present
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')), // Allow empty string or valid URL
  fileUrl: z.string().url().optional().or(z.literal('')), // Allow empty string or valid URL
  fileName: z.string().optional(),
  fileSize: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.extend({
  id: z.string(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;

export const deleteProductsSchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteProductsSchema = z.infer<typeof deleteProductsSchema>;

export const updateProductsSchema = z.object({
  ids: z.array(z.string()),
  isActive: z.boolean().optional(),
  // Add other fields that can be bulk updated here
});

export type UpdateProductsSchema = z.infer<typeof updateProductsSchema>;
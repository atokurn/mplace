"use server";

import { db } from "@/lib/db";
import { categories, type SelectCategory, products } from "@/lib/db/schema";
import { takeFirstFromReturning } from "@/lib/db/utils";
import { eq, inArray, count } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";
// Removed z import and local types to avoid duplicate zod type issues

import { getErrorMessage } from "@/lib/handle-error";

import { createCategorySchema, updateCategorySchema } from "../validations/categories";
// NOTE: Avoid importing inferred Zod TS types here due to cross-bundle typing issues.

// Local TS-only types to avoid cross-module zod type inference issues
// Keep in sync with ../validations/categories.ts
 type CategoryCreateInput = {
   name: string;
   slug?: string;
   description?: string;
   imageUrl?: string | "";
   parentId?: string | null;
   isActive?: boolean;
   sortOrder?: number;
 };
 
 function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createCategory(input: unknown) {
  unstable_noStore();
  try {
    const data = createCategorySchema.parse(input) as CategoryCreateInput;
    // Generate slug from name if not provided
    const providedSlug = data.slug;
    const slug = providedSlug && providedSlug.trim().length > 0
      ? providedSlug
      : generateSlug(data.name);
 
     const newCategory = await db
       .insert(categories)
       .values({
         name: data.name,
         slug,
         description: data.description ?? null,
         imageUrl: (data.imageUrl ?? "") === "" ? null : (data.imageUrl as string),
         parentId: data.parentId ?? null,
         isActive: data.isActive ?? true,
         sortOrder: data.sortOrder ?? 0,
       })
       .returning()
       .then((res) => takeFirstFromReturning(res));
     
     revalidateTag("categories");
 
     return {
       data: newCategory,
       error: null as string | null,
     } as const;
   } catch (error) {
     return {
       data: null,
       error: getErrorMessage(error),
     } as const;
   }
 }
 
export async function updateCategory(input: { id: string } & Record<string, unknown>) {
  unstable_noStore();
  try {
    const { id, ...updateInput } = input;
    const parsedData = updateCategorySchema.parse(updateInput) as Record<string, unknown>;
 
     let updateData: Partial<SelectCategory> = {};
 
     if (typeof parsedData['name'] === 'string') {
       updateData = { ...updateData, name: parsedData['name'] as string };
       // If name is updated and no slug explicitly provided, regenerate slug from new name
       if (!parsedData['slug']) {
         updateData = { ...updateData, slug: generateSlug(parsedData['name'] as string) };
       }
     }
 
     if (typeof parsedData['slug'] === 'string') {
       updateData = { ...updateData, slug: parsedData['slug'] as string };
     }
 
     if (typeof parsedData['description'] !== 'undefined') {
       updateData = { ...updateData, description: (parsedData['description'] as string) ?? null };
     }

     if (typeof parsedData['imageUrl'] !== 'undefined') {
       const val = parsedData['imageUrl'] as string | null | undefined;
       updateData = { ...updateData, imageUrl: !val || val === '' ? null : val };
     }

     if (typeof parsedData['parentId'] !== 'undefined') {
       updateData = { ...updateData, parentId: (parsedData['parentId'] as string | null) ?? null };
     }
 
     if (typeof parsedData['isActive'] === 'boolean') {
       updateData = { ...updateData, isActive: parsedData['isActive'] as boolean };
     }
 
     if (typeof parsedData['sortOrder'] === 'number') {
       updateData = { ...updateData, sortOrder: parsedData['sortOrder'] as number };
     }
 
     const updated = await db
       .update(categories)
       .set(updateData)
       .where(eq(categories.id, id))
       .returning()
       .then((res) => takeFirstFromReturning(res));
     
     revalidateTag("categories");
 
     return {
       data: updated ?? null,
       error: null as string | null,
     } as const;
   } catch (error) {
     return {
       data: null,
       error: getErrorMessage(error),
     } as const;
   }
 }

export async function updateCategories(input: {
  ids: string[];
  isActive?: boolean;
  sortOrder?: number;
}) {
  unstable_noStore();
  try {
    let updateData: Partial<SelectCategory> = {};

    if (typeof input.isActive === "boolean") {
      updateData = { ...updateData, isActive: input.isActive };
    }

    if (typeof input.sortOrder === "number") {
      updateData = { ...updateData, sortOrder: input.sortOrder };
    }

    const updated = await db
      .update(categories)
      .set(updateData)
      .where(inArray(categories.id, input.ids))
      .returning();

    revalidateTag("categories");

    return {
      data: updated,
      error: null as string | null,
    } as const;
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    } as const;
  }
}

import { deleteMultiple, deleteSingle } from "@/lib/actions";

export async function deleteCategory(input: { id: string }) {
  return deleteSingle({
    table: categories,
    id: input.id,
    revalidateTagName: "categories",
    preDelete: async (id: string) => {
      const res = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.categoryId, id));
      const usedCount = res[0]?.count ?? 0;
      if (usedCount > 0) {
        throw new Error(
          "Kategori tidak dapat dihapus karena masih ada produk yang menggunakan kategori ini. Pindahkan produk ke kategori lain terlebih dahulu."
        );
      }
    },
  });
}

export async function deleteCategories(input: { ids: string[] }) {
  return deleteMultiple({
    table: categories,
    ids: input.ids,
    revalidateTagName: "categories",
    preDelete: async (ids: string[]) => {
      const res = await db
        .select({ count: count() })
        .from(products)
        .where(inArray(products.categoryId, ids));
      const usedCount = res[0]?.count ?? 0;
      if (usedCount > 0) {
        throw new Error(
          "Beberapa kategori tidak dapat dihapus karena masih digunakan oleh produk. Pindahkan produk ke kategori lain terlebih dahulu."
        );
      }
    },
  });
}
"use server";

import { db } from "@/lib/db";
import { categories, type SelectCategory } from "@/lib/db/schema";
import { takeFirstOrThrow } from "@/lib/db/utils";
import { asc, eq, inArray, not } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag, unstable_noStore } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";

import type { CreateCategorySchema, UpdateCategorySchema } from "./validations";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createCategory(input: CreateCategorySchema) {
  unstable_noStore();
  try {
    // Generate slug from name if not provided
    let slug = input.slug;
    if (!slug) {
      slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existingCategory.length > 0) {
      return {
        data: null,
        error: "A category with this slug already exists",
      };
    }
    
    const newCategory = await db
      .insert(categories)
      .values({
        ...input,
        slug,
      })
      .returning({
        id: categories.id,
        name: categories.name,
      })
      .then(takeFirstOrThrow);

    revalidateTag("categories");
    revalidateTag("category-counts");

    return {
      data: newCategory,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateCategory(input: UpdateCategorySchema & { id: string }) {
  unstable_noStore();
  try {
    const updateData: Partial<SelectCategory> = {};
    
    if (input.name !== undefined) {
      updateData.name = input.name;
      updateData.slug = generateSlug(input.name);
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
    
    updateData.updatedAt = new Date();

    const data = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, input.id))
      .returning({
        id: categories.id,
        name: categories.name,
      })
      .then(takeFirstOrThrow);

    revalidateTag("categories");
    revalidateTag("category-counts");

    return {
      data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateCategories(input: {
  ids: string[];
  isActive?: boolean;
  sortOrder?: number;
}) {
  unstable_noStore();
  try {
    const updateData: Partial<SelectCategory> = {
      updatedAt: new Date(),
    };
    
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;

    await db
      .update(categories)
      .set(updateData)
      .where(inArray(categories.id, input.ids));

    revalidateTag("categories");
    revalidateTag("category-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCategory(input: { id: string }) {
  unstable_noStore();
  try {
    await db.delete(categories).where(eq(categories.id, input.id));

    revalidateTag("categories");
    revalidateTag("category-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCategories(input: { ids: string[] }) {
  unstable_noStore();
  try {
    await db.delete(categories).where(inArray(categories.id, input.ids));

    revalidateTag("categories");
    revalidateTag("category-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
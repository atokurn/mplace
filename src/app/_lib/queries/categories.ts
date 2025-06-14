"use server";

import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema"; // Added products
import {
  and,
  asc,
  count,
  countDistinct, // Added countDistinct
  desc,
  eq,
  ilike,
  inArray,
  leftJoin, // Added leftJoin
  sql,
} from "drizzle-orm";

import { buildFilterWhere } from "@/lib/filter-columns";
import { unstable_cache } from "next/cache";

import { categoriesSearchParamsCache } from "@/lib/search-params";
import type { GetCategoriesSchema } from "./validations";

export async function getCategories(input: GetCategoriesSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const advancedTable =
          input.filterFlag === "advancedFilters" ||
          input.filterFlag === "commandFilters";

        const advancedWhere = buildFilterWhere(
          input.filters?.map(filter => ({
            column: categories[filter.id as keyof typeof categories] as any,
            value: filter.value,
            operator: filter.operator as any,
          })) || [],
          input.joinOperator,
        );

        const where = advancedTable
          ? advancedWhere
          : and(
              input.name ? ilike(categories.name, `%${input.name}%`) : undefined,
              input.isActive && Array.isArray(input.isActive) && input.isActive.length > 0
                ? inArray(categories.isActive, input.isActive.map(val => val === 'true'))
                : undefined,
              input.description
                ? ilike(categories.description, `%${input.description}%`)
                : undefined,
            );

        let orderBy;
        if (typeof input.sort === 'string' && input.sort.length > 0) {
          const [id, direction] = input.sort.split('.');
          const sortField = categories[id as keyof typeof categories];
          if (sortField) {
            orderBy = direction === 'desc' ? [desc(sortField)] : [asc(sortField)];
          } else {
            // Fallback to default sort if sortField is invalid
            orderBy = [asc(categories.sortOrder), asc(categories.name)];
          }
        } else if (Array.isArray(input.sort) && input.sort.length > 0) {
          // This case handles if input.sort is already an array of objects (future-proofing)
          orderBy = input.sort.map((item: { id: keyof typeof categories, desc: boolean }) =>
            item.desc ? desc(categories[item.id]) : asc(categories[item.id])
          );
        } else {
          orderBy = [asc(categories.sortOrder), asc(categories.name)];
        }

        // const { data, total } = await db.transaction(async (tx) => {
          const data = await db
            .select({
              id: categories.id,
              name: categories.name,
              description: categories.description,
              slug: categories.slug,
              imageUrl: categories.imageUrl,
              isActive: categories.isActive,
              sortOrder: categories.sortOrder,
              createdAt: categories.createdAt,
              updatedAt: categories.updatedAt,
              productCount: countDistinct(products.id), // Added productCount
            })
            .from(categories)
            .leftJoin(products, eq(products.categoryId, categories.id)) // Added leftJoin
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .groupBy(
              categories.id,
              categories.name,
              categories.description,
              categories.slug,
              categories.imageUrl,
              categories.isActive,
              categories.sortOrder,
              categories.createdAt,
              categories.updatedAt,
            ) // Added groupBy
            .orderBy(...orderBy);

          // To get the correct total count with potential joins and grouping for filters,
          // we need a subquery or a separate count that respects the same filters.
          // For simplicity, if advanced filters are not used, a direct count on categories is fine.
          // If advanced filters involve other tables, this count might need adjustment or be performed on the grouped result.
          // For now, let's assume the 'where' clause primarily filters 'categories' table for the total count.
          const totalQuery = db
            .select({
              count: countDistinct(categories.id), // count distinct categories
            })
            .from(categories)
            // If 'where' involves joined tables for filtering, a leftJoin might be needed here too for an accurate total.
            // .leftJoin(products, eq(products.categoryId, categories.id)) // Potentially needed if filters use products table
            .where(where);

          const total = await totalQuery.then((res) => res[0]?.count ?? 0);

          // return {
          //   data,
          //   total,
          // };
        // });


        const pageCount = Math.ceil(total / input.perPage);
        return { data, pageCount };
      } catch (err) {
        console.error("Error fetching categories:", err);
        return { data: [], pageCount: 0 };
      }
    },
    [`categories-${JSON.stringify(input)}`],
    {
      revalidate: 3600, // 1 hour
      tags: ["categories"],
    },
  )();
}

export async function getCategoryStatusCounts() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            status: categories.isActive,
            count: count(),
          })
          .from(categories)
          .groupBy(categories.isActive)
          .orderBy(asc(categories.isActive));

        return data.map((item) => ({
          status: item.status ? "active" : "inactive",
          count: item.count,
        }));
      } catch (err) {
        console.error("Error fetching category status counts:", err);
        return [];
      }
    },
    ["category-status-counts"],
    {
      revalidate: 3600, // 1 hour
      tags: ["categories", "category-counts"],
    },
  )();
}

export async function getCategorySortOrderRange() {
  return await unstable_cache(
    async () => {
      try {
        const result = await db
          .select({
            min: sql<number>`min(${categories.sortOrder})`,
            max: sql<number>`max(${categories.sortOrder})`,
          })
          .from(categories)
          .then((res) => res[0]);

        return {
          min: result?.min ?? 0,
          max: result?.max ?? 100,
        };
      } catch (err) {
        console.error("Error fetching category sort order range:", err);
        return { min: 0, max: 100 };
      }
    },
    ["category-sort-order-range"],
    {
      revalidate: 3600, // 1 hour
      tags: ["categories"],
    },
  )();
}

export async function getCategoryById(id: string) {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select()
          .from(categories)
          .where(eq(categories.id, id))
          .limit(1)
          .then((res) => res[0] ?? null);

        return data;
      } catch (err) {
        console.error("Error fetching category by id:", err);
        return null;
      }
    },
    [`category-${id}`],
    {
      revalidate: 3600, // 1 hour
      tags: ["categories", `category-${id}`],
    },
  )();
}

export async function getAllCategories() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            isActive: categories.isActive,
          })
          .from(categories)
          .where(eq(categories.isActive, true))
          .orderBy(asc(categories.sortOrder), asc(categories.name));

        return data;
      } catch (err) {
        console.error("Error fetching all categories:", err);
        return [];
      }
    },
    ["all-categories"],
    {
      revalidate: 3600, // 1 hour
      tags: ["categories"],
    },
  )();
}
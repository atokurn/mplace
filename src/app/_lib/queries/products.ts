"use server";

import { db } from "@/lib/db";
import { products, categories, users } from "@/lib/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  sql,
} from "drizzle-orm";

import { buildFilterWhere } from "@/lib/filter-columns";
import { unstable_cache } from "next/cache";

import { productsSearchParamsCache } from "@/lib/search-params";
import type { GetProductsSchema } from "../validations/products";

export async function getProducts(input: GetProductsSchema) {
  return await unstable_cache(
    async () => {
      try {

        const offset = (input.page - 1) * input.perPage;
        const advancedTable =
          input.filterFlag === "advancedFilters" ||
          input.filterFlag === "commandFilters";

        const advancedWhere = buildFilterWhere(
          Array.isArray(input.filters) ? input.filters.map(filter => {
            const column = products[filter.id as keyof typeof products] as any;
            return {
              column,
              value: filter.value,
              operator: filter.operator as any,
            };
          }) : [],
          input.joinOperator,
        );

        // Build column filters from URL params
        const columnFilters = [];
        
        // Handle title filter
        if (input.title) {
          columnFilters.push(ilike(products.title, `%${input.title}%`));
        }
        
        // Handle category filter (multiSelect)
        if (input.category && Array.isArray(input.category) && input.category.length > 0) {
          columnFilters.push(inArray(products.category, input.category));
        } else if (input.category && typeof input.category === 'string') {
          columnFilters.push(eq(products.category, input.category));
        }
        
        // Handle isActive filter (multiSelect)
        if (input.isActive && Array.isArray(input.isActive) && input.isActive.length > 0) {
          columnFilters.push(inArray(products.isActive, input.isActive.map(val => val === 'true')));
        }
        
        // Handle price filter (range) - check if price filters exist in URL
        if (input.price && Array.isArray(input.price) && input.price.length === 2) {
          const [minPrice, maxPrice] = input.price.map(p => parseFloat(p));
          if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            columnFilters.push(
              and(
                sql`${products.price} >= ${minPrice}`,
                sql`${products.price} <= ${maxPrice}`
              )
            );
          }
        }

        const where = advancedTable
          ? advancedWhere
          : columnFilters.length > 0
          ? and(...columnFilters)
          : undefined;
          


        const orderBy =
          input.sort === "title.asc"
            ? asc(products.title)
            : input.sort === "title.desc"
            ? desc(products.title)
            : input.sort === "price.asc"
            ? asc(products.price)
            : input.sort === "price.desc"
            ? desc(products.price)
            : input.sort === "createdAt.asc"
            ? asc(products.createdAt)
            : input.sort === "createdAt.desc"
            ? desc(products.createdAt)
            : input.sort === "downloadCount.asc"
            ? asc(products.downloadCount)
            : input.sort === "downloadCount.desc"
            ? desc(products.downloadCount)
            : desc(products.createdAt);

        // Execute queries separately since Neon HTTP doesn't support transactions
        const data = await db
          .select({
            id: products.id,
            title: products.title,
            description: products.description,
            price: products.price,
            categoryId: products.categoryId,
            category: products.category,
            tags: products.tags,
            imageUrl: products.imageUrl,
            thumbnailUrl: products.thumbnailUrl,
            fileUrl: products.fileUrl,
            fileName: products.fileName,
            fileSize: products.fileSize,
            fileFormat: products.fileFormat,
            dimensions: products.dimensions,
            downloadCount: products.downloadCount,
            isActive: products.isActive,
            createdBy: products.createdBy,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
          })
          .from(products)
          .limit(input.perPage)
          .offset(offset)
          .where(where)
          .orderBy(orderBy);

        const total = await db
          .select({
            count: count(),
          })
          .from(products)
          .where(where)
          .execute()
          .then((res) => res[0]?.count ?? 0);

        const pageCount = Math.ceil(total / input.perPage);
        


        return {
          data,
          pageCount,
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        return {
          data: [],
          pageCount: 0,
        };
      }
    },
    [`products-${JSON.stringify(input)}`],
    {
      revalidate: 3600,
      tags: ["products"],
    },
  )();
}

// Get product status counts for advanced filtering
export async function getProductStatusCounts() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            isActive: products.isActive,
            count: count(),
          })
          .from(products)
          .groupBy(products.isActive);

        return data.reduce(
          (acc, { isActive, count }) => {
            acc[isActive ? "active" : "inactive"] = count;
            return acc;
          },
          { active: 0, inactive: 0 } as Record<string, number>,
        );
      } catch (error) {
        console.error("Error fetching product status counts:", error);
        return { active: 0, inactive: 0 };
      }
    },
    ["product-status-counts"],
    {
      revalidate: 3600,
      tags: ["products"],
    },
  )();
}

// Get product category counts for advanced filtering
export async function getProductCategoryCounts() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            category: products.category,
            count: count(),
          })
          .from(products)
          .where(eq(products.isActive, true))
          .groupBy(products.category)
          .orderBy(desc(count()));

        const result = data.reduce(
          (acc, { category, count }) => {
            if (category) {
              acc[category] = count;
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        return result;
      } catch (error) {
        console.error("Error fetching product category counts:", error);
        return {};
      }
    },
    ["product-category-counts"],
    {
      revalidate: 3600,
      tags: ["products"],
    },
  )();
}

// Get product price range for advanced filtering
export async function getProductPriceRange() {
  return await unstable_cache(
    async () => {
      try {
        const data = await db
          .select({
            min: sql<number>`min(${products.price})`,
            max: sql<number>`max(${products.price})`,
          })
          .from(products)
          .where(eq(products.isActive, true));

        const result = data[0];
        return {
          min: result?.min ?? 0,
          max: result?.max ?? 100,
        };
      } catch (error) {
        console.error("Error fetching product price range:", error);
        return { min: 0, max: 100 };
      }
    },
    ["product-price-range"],
    {
      revalidate: 3600,
      tags: ["products"],
    },
  )();
}

export async function getProductById(id: string) {
  return await unstable_cache(
    async () => {
      try {
        const product = await db
          .select()
          .from(products)
          .where(eq(products.id, id))
          .limit(1)
          .then((res) => res[0] ?? null);

        return product;
      } catch (err) {
        console.error("Error fetching product:", err);
        return null;
      }
    },
    [`product-${id}`],
    {
      revalidate: 3600,
      tags: [`product-${id}`],
    }
  )();
}

export async function getProductsByCategory(categoryId: string, limit = 10) {
  return await unstable_cache(
    async () => {
      try {
        const productsList = await db
          .select()
          .from(products)
          .where(
            and(
              eq(products.categoryId, categoryId),
              eq(products.isActive, true)
            )
          )
          .limit(limit)
          .orderBy(desc(products.createdAt));

        return productsList;
      } catch (err) {
        console.error("Error fetching products by category:", err);
        return [];
      }
    },
    [`products-category-${categoryId}-${limit}`],
    {
      revalidate: 3600,
      tags: ["products", `category-${categoryId}`],
    }
  )();
}

export async function getFeaturedProducts(limit = 8) {
  return await unstable_cache(
    async () => {
      try {
        const productsList = await db
          .select()
          .from(products)
          .where(eq(products.isActive, true))
          .limit(limit)
          .orderBy(desc(products.downloadCount));

        return productsList;
      } catch (err) {
        console.error("Error fetching featured products:", err);
        return [];
      }
    },
    [`featured-products-${limit}`],
    {
      revalidate: 3600,
      tags: ["products"],
    }
  )();
}

export async function getProductStats() {
  return await unstable_cache(
    async () => {
      try {
        const stats = await db
          .select({
            total: count(),
            active: sql<number>`count(case when ${products.isActive} = true then 1 end)`,
            inactive: sql<number>`count(case when ${products.isActive} = false then 1 end)`,
            totalDownloads: sql<number>`sum(${products.downloadCount})`,
          })
          .from(products)
          .then((res) => res[0]);

        return {
          total: stats?.total ?? 0,
          active: stats?.active ?? 0,
          inactive: stats?.inactive ?? 0,
          totalDownloads: stats?.totalDownloads ?? 0,
        };
      } catch (err) {
        console.error("Error fetching product stats:", err);
        return {
          total: 0,
          active: 0,
          inactive: 0,
          totalDownloads: 0,
        };
      }
    },
    ["product-stats"],
    {
      revalidate: 3600,
      tags: ["products"],
    }
  )();
}

export async function searchProducts(query: string, limit = 20) {
  return await unstable_cache(
    async () => {
      try {
        const productsList = await db
          .select()
          .from(products)
          .where(
            and(
              eq(products.isActive, true),
              ilike(products.title, `%${query}%`)
            )
          )
          .limit(limit)
          .orderBy(desc(products.downloadCount));

        return productsList;
      } catch (err) {
        console.error("Error searching products:", err);
        return [];
      }
    },
    [`search-products-${query}-${limit}`],
    {
      revalidate: 3600,
      tags: ["products"],
    }
  )();
}
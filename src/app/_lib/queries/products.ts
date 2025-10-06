"use server";

import { db } from "@/lib/db";
import { products, productVariants, inventory, orderItems } from "@/lib/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  sql,
  or,
} from "drizzle-orm";

import { buildFilterWhere } from "@/lib/filter-columns";
import { unstable_cache } from "next/cache";

import type { GetProductsSchema } from "../validations/products";
import type { PgColumn } from "drizzle-orm/pg-core";

export async function getProducts(input: GetProductsSchema) {
  return await unstable_cache(
    async () => {
      try {

        const offset = (input.page - 1) * input.perPage;
        const advancedTable =
          input.filterFlag === "advancedFilters" ||
          input.filterFlag === "commandFilters";

        const filterOperators = [
          "eq",
          "ne",
          "ilike",
          "notIlike",
          "isNull",
          "isNotNull",
          "gte",
          "lte",
          "gt",
          "lt",
          "in",
        ] as const;

        type FilterOperatorLocal = typeof filterOperators[number];

        function isFilterOperator(value: unknown): value is FilterOperatorLocal {
          return (
            typeof value === "string" &&
            (filterOperators as readonly string[]).includes(value)
          );
        }

        const advancedWhere = buildFilterWhere(
          Array.isArray(input.filters)
            ? (input.filters.map((filter) => {
                const column = products[
                  filter.id as keyof typeof products
                ] as unknown as PgColumn;
                const operator: FilterOperatorLocal = isFilterOperator(
                  filter.operator,
                )
                  ? filter.operator
                  : "eq";
                return {
                  column,
                  value: filter.value,
                  operator,
                };
              }) as unknown as Parameters<typeof buildFilterWhere>[0])
            : [],
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
        
        // Handle price filter (range) - support min and/or max
        if (input.price && Array.isArray(input.price)) {
          const [rawMin, rawMax] = input.price;
          const minPrice = rawMin !== undefined && rawMin !== '' ? parseFloat(rawMin) : NaN;
          const maxPrice = rawMax !== undefined && rawMax !== '' ? parseFloat(rawMax) : NaN;
          
          if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            columnFilters.push(
              and(
                sql`${products.price} >= ${minPrice}`,
                sql`${products.price} <= ${maxPrice}`,
              ),
            );
          } else if (!isNaN(minPrice)) {
            columnFilters.push(sql`${products.price} >= ${minPrice}`);
          } else if (!isNaN(maxPrice)) {
            columnFilters.push(sql`${products.price} <= ${maxPrice}`);
          }
        }

        // Handle tags filter (match any selected tag)
        if (input.tags && Array.isArray(input.tags) && input.tags.length > 0) {
          const tagConds = input.tags
            .filter((t) => typeof t === 'string' && t.trim().length > 0)
            .map((t) => sql`${products.tags}::text ILIKE ${`%"${t}"%`}`);
          if (tagConds.length > 0) {
            columnFilters.push(or(...tagConds));
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
            : input.sort === "viewCount.asc"
            ? asc(products.viewCount)
            : input.sort === "viewCount.desc"
            ? desc(products.viewCount)
            : desc(products.createdAt);

        // Execute queries separately since Neon HTTP doesn't support transactions
        const data = await db
          .select()
          .from(products)
          .limit(input.perPage)
          .offset(offset)
          .where(where)
          .orderBy(orderBy);

        // ---- NEW: compute aggregates and variants for returned products ----
        const productIds = data.map((p) => p.id);
        // Early return if no products
        if (productIds.length === 0) {
          return {
            data: [],
            pageCount: 0,
          };
        }

        // Import needed tables locally to avoid circular imports at top in Fast Apply
        // (removed dynamic imports; using top-level imports for schema and drizzle functions)

        // Fetch variants with their stock
        const variantRows = await db
          .select({
            id: productVariants.id,
            productId: productVariants.productId,
            sku: productVariants.sku,
            title: productVariants.title,
            price: productVariants.price,
            compareAtPrice: productVariants.compareAtPrice,
            stock: sql<number>`COALESCE(SUM(${inventory.stock} - ${inventory.reserved}), 0)`,
          })
          .from(productVariants)
          .leftJoin(inventory, eq(inventory.variantId, productVariants.id))
          .where(inArray(productVariants.productId, productIds))
          .groupBy(
            productVariants.id,
            productVariants.productId,
            productVariants.sku,
            productVariants.title,
            productVariants.price,
            productVariants.compareAtPrice,
          );

        // Product-level inventory (variantId is null)
        const productInventoryRows = await db
          .select({
            productId: inventory.productId,
            stock: sql<number>`COALESCE(SUM(${inventory.stock} - ${inventory.reserved}), 0)`,
          })
          .from(inventory)
          .where(
            and(
              inArray(inventory.productId, productIds),
              sql`${inventory.variantId} IS NULL`,
            ),
          )
          .groupBy(inventory.productId);

        // Sales count per product
        const salesRows = await db
          .select({
            productId: orderItems.productId,
            salesCount: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`,
          })
          .from(orderItems)
          .where(inArray(orderItems.productId, productIds))
          .groupBy(orderItems.productId);

        // Define strong type for variant aggregation and replace any[] map
        type VariantAgg = {
          id: string;
          productId: string;
          sku: string | null;
          title: string | null;
          price: number | null;
          compareAtPrice: number | null;
          stock: number;
        };
        const variantsByProduct = new Map<string, VariantAgg[]>();
        for (const v of variantRows) {
          const list = variantsByProduct.get(v.productId) ?? [];
          list.push({
            id: v.id,
            productId: v.productId,
            sku: v.sku ?? null,
            title: v.title ?? null,
            price:
              v.price !== null && v.price !== undefined
                ? Number((v.price as unknown) as string)
                : null,
            compareAtPrice:
              v.compareAtPrice !== null && v.compareAtPrice !== undefined
                ? Number((v.compareAtPrice as unknown) as string)
                : null,
            stock: Number(v.stock ?? 0),
          });
          variantsByProduct.set(v.productId, list);
        }

        const productInventoryMap = new Map<string, number>();
        for (const r of productInventoryRows) {
          productInventoryMap.set(r.productId!, Number(r.stock ?? 0));
        }

        const salesMap = new Map<string, number>();
        for (const r of salesRows) {
          salesMap.set(r.productId!, Number(r.salesCount ?? 0));
        }

        // Type the extended array and remove any casts
        // Insert ProductRow type based on selected data shape
        // and type the extended array accordingly
        // Replace the original untyped declaration
        // const extended = data.map((p) => {
        // with the following typed version:
        type ProductRow = typeof data[number];
        const extended: Array<
          ProductRow & {
            variants: VariantAgg[];
            variantCount: number;
            totalStock: number;
            priceMin: number;
            priceMax: number;
            compareAtMin: number | null;
            compareAtMax: number | null;
            salesCount: number;
          }
        > = data.map((p) => {
          const variants = variantsByProduct.get(p.id) ?? [];
          const variantPrices = variants
            .map((v) => (v.price !== null && v.price !== undefined ? v.price : NaN))
            .filter((n) => !Number.isNaN(n));
          const productPrice = p.price !== null && p.price !== undefined ? Number(p.price as unknown as string) : NaN;

          const minPriceCandidates = [...variantPrices, productPrice].filter((n) => !Number.isNaN(n));
          const maxPriceCandidates = [...variantPrices, productPrice].filter((n) => !Number.isNaN(n));
          const minPrice = minPriceCandidates.length ? Math.min(...minPriceCandidates) : 0;
          const maxPrice = maxPriceCandidates.length ? Math.max(...maxPriceCandidates) : 0;

          const compareAtPrices = variants
            .map((v) => (v.compareAtPrice !== null && v.compareAtPrice !== undefined ? v.compareAtPrice : NaN))
            .filter((n) => !Number.isNaN(n));
          const productOrig = p.originalPrice !== undefined && p.originalPrice !== null ? Number(p.originalPrice as unknown as string) : NaN;
          const minCompareAt = [...compareAtPrices, productOrig].filter((n) => !Number.isNaN(n)).reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
          const maxCompareAt = [...compareAtPrices, productOrig].filter((n) => !Number.isNaN(n)).reduce((a, b) => Math.max(a, b), 0);

          const variantStockSum = variants.reduce((sum, v) => sum + Number(v.stock ?? 0), 0);
          const productLevelStock = productInventoryMap.get(p.id) ?? 0;
          const totalStock = variantStockSum + productLevelStock;

          const salesCount = salesMap.get(p.id) ?? 0;

          return {
            ...p,
            variants,
            variantCount: variants.length,
            totalStock,
            priceMin: minPrice,
            priceMax: maxPrice,
            compareAtMin: Number.isFinite(minCompareAt) ? minCompareAt : null,
            compareAtMax: maxCompareAt || null,
            salesCount,
          };
        });

        // ---- END NEW ----

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
          data: extended,
          pageCount,
          total,
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
          .orderBy(desc(products.viewCount));

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
            // removed totalDownloads
          })
          .from(products)
          .then((res) => res[0]);

        return {
          total: stats?.total ?? 0,
          active: stats?.active ?? 0,
          inactive: stats?.inactive ?? 0,
          // removed totalDownloads from return
        } as const;
      } catch (err) {
        console.error("Error fetching product stats:", err);
        return {
          total: 0,
          active: 0,
          inactive: 0,
          // removed totalDownloads from fallback
        } as const;
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
          .orderBy(desc(products.viewCount));

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
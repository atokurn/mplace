"use server";

import { db } from "@/lib/db";
import { products, productVariants, inventory } from "@/lib/db/schema";
import { takeFirstOrThrow } from "@/lib/db/utils";
import { eq, inArray } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";
import type { NewProduct } from "@/lib/db/schema";

import { getErrorMessage } from "@/lib/handle-error";

import type { 
  UpdateProductSchema,
  DeleteProductsSchema,
  UpdateProductsSchema,
  UpdateVariantsSchema,
} from "../validations/products";
import { 
  createProductSchema,
  updateProductSchema,
  deleteProductsSchema as deleteProductsZod,
  updateProductsSchema as updateProductsZod,
  updateVariantsSchema as updateVariantsZod,
} from "../validations/products";
import { z } from "zod";
import { deleteMultiple, deleteSingle } from "@/lib/actions";

export async function createProduct(input: z.input<typeof createProductSchema>) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to create a product",
      };
    }

    // Validate and prepare product data
    const parsed = createProductSchema.parse(input);
    const productData = {
      ...parsed,
      createdBy: session.user.id,
    } as NewProduct;

    const newProduct = await db
      .insert(products)
      .values(productData)
      .returning()
      .then(takeFirstOrThrow);

    // NEW: Insert variants (and inventory) if provided
    if (parsed.variants && Array.isArray(parsed.variants) && parsed.variants.length > 0) {
      try {
        // Prepare variant rows
        const variantRows = parsed.variants.map((v) => {
          const autoTitle = v.title ?? (
            v.attributes
              ? Object.entries(v.attributes)
                  .filter(([key, val]) => key && val)
                  .map(([key, val]) => `${key}: ${val}`)
                  .join(" / ")
              : undefined
          );
          return {
            productId: newProduct.id,
            sku: v.sku,
            title: autoTitle,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            attributes: v.attributes,
            imageUrl: v.imageUrl,
            barcode: v.barcode,
            packageWeightGrams: v.packageWeightGrams,
            weightUnit: v.weightUnit ?? "g",
            packageLengthCm: v.packageLengthCm,
            packageWidthCm: v.packageWidthCm,
            packageHeightCm: v.packageHeightCm,
            preOrderEnabled: v.preOrderEnabled ?? false,
            isActive: v.isActive ?? true,
          };
        });
  
        const insertedVariants = await db
          .insert(productVariants)
          .values(variantRows)
          .returning();
  
        // Insert inventory rows per variant
        for (let i = 0; i < insertedVariants.length; i++) {
          const vInput = parsed.variants[i];
          const vRow = insertedVariants[i];
          const stockVal = typeof vInput.stock === "number" && vInput.stock >= 0 ? vInput.stock : 0;
          await db.insert(inventory).values({
            productId: newProduct.id,
            variantId: vRow.id,
            stock: stockVal,
            reserved: 0,
            lowStockThreshold: 0,
          });
        }
      } catch (variantErr) {
        return {
          data: newProduct,
          error: `Product created, but failed to save variants: ${getErrorMessage(variantErr)}`,
        };
      }
    }
  
    revalidateTag("products");
  
    return {
      data: newProduct,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateProduct(input: UpdateProductSchema) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to update a product",
      };
    }

    const { id: idStr } = updateProductSchema.pick({ id: true }).parse(input);
    const updateData = updateProductSchema.omit({ id: true }).parse(input);
     const product = await db
       .select()
       .from(products)
      .where(eq(products.id, idStr))
       .limit(1)
       .then((res) => res[0]);

    if (!product) {
      return {
        data: null,
        error: "Product not found",
      };
    }

    // Check if user is admin or the creator of the product
    if (session.user.role !== "admin" && product.createdBy !== session.user.id) {
      return {
        data: null,
        error: "You don't have permission to update this product",
      };
    }

     const updatedProduct = await db
       .update(products)
       .set({
         ...(updateData as Partial<NewProduct>),
         updatedAt: new Date(),
       })
       .where(eq(products.id, idStr))
       .returning()
       .then(takeFirstOrThrow);

    revalidateTag("products");
    revalidateTag(`product-${idStr}`);

    return {
      data: updatedProduct,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteProduct(input: { id: string }) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to delete this product",
      };
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, input.id))
      .limit(1)
      .then((res) => res[0]);

    if (!product) {
      return {
        data: null,
        error: "Product not found",
      };
    }

    if (session.user.role !== "admin" && product.createdBy !== session.user.id) {
      return {
        data: null,
        error: "You don't have permission to delete this product",
      };
    }

    return deleteSingle({
      table: products,
      id: input.id,
      revalidateTagName: "products",
    });
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteProducts(input: DeleteProductsSchema) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to delete products",
      };
    }

    if (session.user.role !== "admin") {
      return {
        data: null,
        error: "You don't have permission to delete products",
      };
    }

    const parsed: DeleteProductsSchema = deleteProductsZod.parse(input);

    return deleteMultiple({
      table: products,
      ids: parsed.ids,
      revalidateTagName: "products",
    });
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateProducts(input: UpdateProductsSchema) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to update products",
      };
    }

    if (session.user.role !== "admin") {
      return {
        data: null,
        error: "You don't have permission to update products",
      };
    }

    const parsed: UpdateProductsSchema = updateProductsZod.parse(input);
    const { ids, ...updateData } = parsed;
    const updatedProducts = await db
      .update(products)
      .set({
        ...(updateData as Partial<NewProduct>),
        updatedAt: new Date(),
      })
      .where(inArray(products.id, ids))
      .returning();

    revalidateTag("products");
    ids.forEach(id => {
      revalidateTag(`product-${id}`);
    });

    return {
      data: updatedProducts,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function toggleProductStatus(id: string) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to update this product",
      };
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
      .then((res) => res[0]);

    if (!product) {
      return {
        data: null,
        error: "Product not found",
      };
    }

    if (session.user.role !== "admin" && product.createdBy !== session.user.id) {
      return {
        data: null,
        error: "You don't have permission to update this product",
      };
    }

    const updatedProduct = await db
      .update(products)
      .set({
        isActive: !product.isActive,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning()
      .then(takeFirstOrThrow);

    revalidateTag("products");
    revalidateTag(`product-${id}`);

    return {
      data: updatedProduct,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateVariants(input: UpdateVariantsSchema) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to update variants",
      };
    }

    if (session.user.role !== "admin") {
      return {
        data: null,
        error: "You don't have permission to update variants",
      };
    }

    const parsed = updateVariantsZod.parse(input);

    const updatedVariantIds: string[] = [];
    const productIds = new Set<string>();

    for (const item of parsed.items) {
      // Ensure variant exists
      const variant = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, item.id))
        .limit(1)
        .then((res) => res[0]);

      if (!variant) {
        // Skip missing variant but continue processing others
        continue;
      }

      productIds.add(variant.productId);

      // Update variant pricing fields if provided
      if (item.price !== undefined || item.compareAtPrice !== undefined) {
        await db
          .update(productVariants)
          .set({
            ...(item.price !== undefined ? { price: item.price } : {}),
            ...(item.compareAtPrice !== undefined ? { compareAtPrice: item.compareAtPrice } : {}),
            updatedAt: new Date(),
          })
          .where(eq(productVariants.id, item.id));
      }

      // Update inventory stock aggregation if provided
      if (item.stock !== undefined) {
        const invRows = await db
          .select()
          .from(inventory)
          .where(eq(inventory.variantId, item.id));

        const reservedSum = invRows.reduce((acc, row) => acc + Number(row.reserved ?? 0), 0);

        if (invRows.length === 0) {
          // Create a single inventory row for the variant
          await db.insert(inventory).values({
            productId: variant.productId,
            variantId: item.id,
            stock: (item.stock ?? 0) + reservedSum,
            reserved: reservedSum,
            lowStockThreshold: 0,
            updatedAt: new Date(),
          });
        } else {
          // Normalize to one active row: set the first row to desired available stock + reserved, zero out others
          const [primary, ...rest] = invRows;
          await db
            .update(inventory)
            .set({ stock: (item.stock ?? 0) + reservedSum, reserved: reservedSum, updatedAt: new Date() })
            .where(eq(inventory.id, primary.id));

          for (const r of rest) {
            await db
              .update(inventory)
              .set({ stock: 0, reserved: 0, updatedAt: new Date() })
              .where(eq(inventory.id, r.id));
          }
        }
      }

      updatedVariantIds.push(item.id);
    }

    // Revalidate product lists and individual product caches
    revalidateTag("products");
    productIds.forEach((pid) => revalidateTag(`product-${pid}`));

    return {
      data: updatedVariantIds,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
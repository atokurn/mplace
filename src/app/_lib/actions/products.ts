"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
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
  UpdateProductsSchema 
} from "../validations/products";
import { 
  createProductSchema,
  updateProductSchema,
  deleteProductsSchema as deleteProductsZod,
  updateProductsSchema as updateProductsZod,
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
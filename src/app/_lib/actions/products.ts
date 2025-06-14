"use server";

import { db } from "@/lib/db";
import { products, type SelectProduct } from "@/lib/db/schema";
import { takeFirstOrThrow } from "@/lib/db/utils";
import { asc, eq, inArray, not } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getErrorMessage } from "@/lib/handle-error";

import type { 
  CreateProductSchema, 
  UpdateProductSchema,
  DeleteProductsSchema,
  UpdateProductsSchema 
} from "../validations/products";

export async function createProduct(input: CreateProductSchema & {
  hasCommercialPrice?: boolean;
  commercialPrice?: string;
}) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to create a product",
      };
    }

    const { hasCommercialPrice, ...productData } = input;
    
    const newProduct = await db
      .insert(products)
      .values({
        ...productData,
        commercialPrice: hasCommercialPrice ? productData.commercialPrice : null,
        createdBy: session.user.id,
      })
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to update a product",
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

    // Check if user is admin or the creator of the product
    if (session.user.role !== "admin" && product.createdBy !== session.user.id) {
      return {
        data: null,
        error: "You don't have permission to update this product",
      };
    }

    const { id, ...updateData } = input;
    const updatedProduct = await db
      .update(products)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, input.id))
      .returning()
      .then(takeFirstOrThrow);

    revalidateTag("products");
    revalidateTag(`product-${input.id}`);

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

export async function deleteProducts(input: DeleteProductsSchema) {
  unstable_noStore();
  try {
    const session = await getServerSession(authOptions);
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

    const deletedProducts = await db
      .delete(products)
      .where(inArray(products.id, input.ids))
      .returning();

    revalidateTag("products");
    input.ids.forEach(id => {
      revalidateTag(`product-${id}`);
    });

    return {
      data: deletedProducts,
      error: null,
    };
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
    const session = await getServerSession(authOptions);
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

    const { ids, ...updateData } = input;
    const updatedProducts = await db
      .update(products)
      .set({
        ...updateData,
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        data: null,
        error: "You must be logged in to update product status",
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

export async function incrementDownloadCount(id: string) {
  unstable_noStore();
  try {
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

    const updatedProduct = await db
      .update(products)
      .set({
        downloadCount: product.downloadCount + 1,
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
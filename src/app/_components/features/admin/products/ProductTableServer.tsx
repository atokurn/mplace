import { getProducts, getProductCategoryCounts, getProductPriceRange } from "@/app/_lib/queries/products";
import { productsSearchParamsCache } from "@/lib/search-params";
import type { SearchParams } from "@/types";
import type { GetProductsSchema } from "@/app/_lib/validations/products";
import * as React from "react";
import { ProductTableClient } from "./ProductTableClient";

interface ProductTableServerProps {
  searchParams: SearchParams;
}

export async function ProductTableServer({ searchParams }: ProductTableServerProps) {
  const search = productsSearchParamsCache.parse(searchParams) as unknown as GetProductsSchema;
  
  const productsPromise = getProducts(search);
  const categoryCounts = await getProductCategoryCounts();
  const priceRange = await getProductPriceRange();

  return <ProductTableClient productsPromise={productsPromise} categoryCounts={categoryCounts} priceRange={priceRange} />;
}
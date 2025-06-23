import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import * as React from "react";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/app/_components/shared/layouts/shell";
import { Button } from "@/components/ui/button";

import type { SearchParams } from "@/types";

import { ProductTableServer } from "@/app/_components/features/admin/products/ProductTableServer";
import { productsSearchParamsCache } from "@/lib/search-params";

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your digital products and inventory",
};

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;

  return (
    <Shell variant="sidebar" className="gap-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">
                Manage your digital products and inventory
              </p>
            </div>
            <Button asChild>
              <Link href="/products/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={8}
                filterCount={3}
                cellWidths={[
                  "10rem",
                  "25rem",
                  "12rem",
                  "10rem",
                  "8rem",
                  "10rem",
                  "8rem",
                  "8rem",
                ]}
                withPagination
                shrinkZero
              />
            }
          >
            <ProductTableServer searchParams={searchParams} />
          </React.Suspense>
        </div>
    </Shell>
  );
}
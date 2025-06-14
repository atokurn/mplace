import { Suspense } from "react";
import { CategoryTableClient } from "./CategoryTableClient";
import { getCategories, getCategoryStatusCounts } from "@/app/_lib/queries/categories";
import { categoriesSearchParamsCache } from "@/lib/search-params";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

interface CategoryTableServerProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function CategoryTableServer({ searchParams }: CategoryTableServerProps) {
  const search = categoriesSearchParamsCache.parse(searchParams);
  
  const categoriesPromise = getCategories(search);
  const statusCountsPromise = getCategoryStatusCounts();

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
        columnCount={9}
        searchableColumnCount={1}
        filterableColumnCount={1}
        cellWidths={["10rem", "20rem", "15rem", "10rem", "8rem", "8rem", "8rem", "8rem", "10rem", "8rem"]}
        shrinkZero
      />
      }
    >
      <CategoryTableClient
        categoriesPromise={categoriesPromise}
        statusCountsPromise={statusCountsPromise}
      />
    </Suspense>
  );
}
"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { Product } from "@/lib/db/schema";
import { getProductsTableColumns } from "./products-table-columns";
import { ProductTableActionBar } from "./ProductTableActionBar";
import { formatPrice } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface ProductTableClientProps {
  productsPromise: Promise<{
    data: Product[];
    pageCount: number;
  }>;
  categoryCounts?: Record<string, number>;
  priceRange?: { min: number; max: number };
}

export function ProductTableClient({ productsPromise, categoryCounts, priceRange }: ProductTableClientProps) {
  const { data, pageCount } = React.use(productsPromise);

  const columns = React.useMemo(
    () =>
      getProductsTableColumns({
        statusCounts: { active: 0, inactive: 0 },
        categoryCounts: categoryCounts ?? {},
        priceRange: priceRange ?? { min: 0, max: 0 },
      }),
    [categoryCounts, priceRange]
  );

  const { table } = useDataTable<Product>({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { left: ["select", "title"], right: ["actions"] },
      expanded: {},
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    filterFns: {
      arrIncludesSome: (row, columnId, filterValue) => {
        if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) {
          return true;
        }
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        const cellValueStr = String(cellValue);
        return filterValue.some((val) => cellValueStr === String(val));
      },
      includesString: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
      },
      inNumberRange: (row, columnId, filterValue) => {
        if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
        const [rawMin, rawMax] = filterValue as unknown as [number | string | undefined, number | string | undefined];
        const valRaw = row.getValue(columnId);
        const val = Number(valRaw);
        const min = rawMin !== undefined && rawMin !== null && rawMin !== "" ? Number(rawMin) : NaN;
        const max = rawMax !== undefined && rawMax !== null && rawMax !== "" ? Number(rawMax) : NaN;
        if (Number.isNaN(val)) return false;
        const minOk = Number.isNaN(min) ? true : val >= min;
        const maxOk = Number.isNaN(max) ? true : val <= max;
        return minOk && maxOk;
      },
    },
  });

  return (
    <DataTable table={table} renderSubRow={(row) => {
      const p = row.original as any;
      const variants = Array.isArray(p?.variants) ? p.variants : [];
      if (!variants || variants.length === 0) return null;
      return (
        <div className="px-4 py-3">
          <Accordion type="single" collapsible defaultValue={`variants-${p.id}`}>
            <AccordionItem value={`variants-${p.id}`}>
              <AccordionTrigger className="text-xs text-muted-foreground hover:text-foreground">
                <div className="flex w-full items-center justify-between">
                  <div>{variants.length} SKU</div>
                  <button type="button" className="hover:underline" onClick={row.getToggleExpandedHandler()}>Sembunyikan</button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {variants.map((v: any) => {
                    const sell = typeof v.price === "number" ? formatPrice(v.price, "IDR") : "-";
                    const promo = typeof v.compareAtPrice === "number" ? formatPrice(v.compareAtPrice, "IDR") : undefined;
                    return (
                      <div key={v.id} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{v.title ?? "Varian"}</span>
                          <span className="text-xs text-muted-foreground">{v.sku}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{sell}</div>
                            {promo ? <div className="text-xs text-muted-foreground">Promosi: {promo}</div> : null}
                          </div>
                          <div className="text-sm text-muted-foreground">Stok: {v.stock ?? 0}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    }}>
      <DataTableToolbar table={table}>
        <ProductTableActionBar table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
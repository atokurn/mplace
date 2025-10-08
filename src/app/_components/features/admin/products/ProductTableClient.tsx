"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { Product } from "@/lib/db/schema";
import { getProductsTableColumns } from "./products-table-columns";
import { ProductTableActionBar } from "./ProductTableActionBar";
import { formatPrice } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateVariants } from "@/app/_lib/actions/products";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface ProductTableClientProps {
  productsPromise: Promise<{
    data: Product[];
    pageCount: number;
  }>;
  categoryCounts?: Record<string, number>;
  priceRange?: { min: number; max: number };
}

function BulkVariantEditor({ variants }: { variants: any[] }) {
  const [open, setOpen] = React.useState(false);
  const [price, setPrice] = React.useState<string>("");
  const [compareAtPrice, setCompareAtPrice] = React.useState<string>("");
  const [stock, setStock] = React.useState<string>("");
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const onApply = React.useCallback(() => {
    const hasPrice = price.trim() !== "" && !Number.isNaN(Number(price));
    const hasCompare = compareAtPrice.trim() !== "" && !Number.isNaN(Number(compareAtPrice));
    const hasStock = stock.trim() !== "" && !Number.isNaN(Number(stock));

    if (!hasPrice && !hasCompare && !hasStock) {
      toast.info("Isi minimal satu field untuk ubah sekaligus");
      return;
    }

    const items = variants.map((v) => ({
      id: v.id,
      ...(hasPrice ? { price: price.trim() } : {}),
      ...(hasCompare ? { compareAtPrice: compareAtPrice.trim() } : {}),
      ...(hasStock ? { stock: Number(stock) } : {}),
    }));

    startTransition(async () => {
      const { error } = await updateVariants({ items });
      if (error) {
        toast.error(error);
        return;
      }
      toast.success(`Berhasil memperbarui ${items.length} varian`);
      setPrice("");
      setCompareAtPrice("");
      setStock("");
      setOpen(false);
      router.refresh();
    });
  }, [price, compareAtPrice, stock, variants, router]);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setOpen((o) => !o)} disabled={isPending}>
          Ubah sekaligus
        </Button>
        {open ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Harga</span>
              <Input type="number" inputMode="numeric" placeholder="0" className="h-7 w-24 px-2 text-xs" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Promosi</span>
              <Input type="number" inputMode="numeric" placeholder="0" className="h-7 w-24 px-2 text-xs" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Stok</span>
              <Input type="number" inputMode="numeric" placeholder="0" className="h-7 w-20 px-2 text-xs" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <Button type="button" size="sm" className="h-7 px-2 text-xs" onClick={onApply} disabled={isPending}>
              Terapkan
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
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
    // Pastikan baris dapat diexpand hanya jika punya varian
    getRowCanExpand: (row) => {
      const p = row.original as any;
      const variants = Array.isArray(p?.variants) ? p.variants : [];
      return variants.length > 0;
    },
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
    <DataTable
      table={table}
      renderExpandTrigger={(row) => {
        const p = row.original as any;
        const variants = Array.isArray(p?.variants) ? p.variants : [];
        const variantCount: number = variants.length;
        if (!variantCount) return null;
        const isExpanded = row.getIsExpanded();
        return (
          <div className="">
            <div
              className="relative flex w-full items-center justify-between border-t border-dashed px-4 py-2 text-xs cursor-pointer select-none"
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
              onClick={row.getToggleExpandedHandler()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  row.toggleExpanded();
                }
              }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">{variantCount} SKU</span>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:underline"
                  aria-expanded={isExpanded}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    row.toggleExpanded();
                  }}
                >
                  {isExpanded ? "Tutup" : "Buka"}
                </button>
                <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`} />
              </div>
            </div>
          </div>
        );
      }}
      renderSubRow={(row) => {
        const p = row.original as any;
        const variants = Array.isArray(p?.variants) ? p.variants : [];
        if (!variants.length) return null;
        const isExpanded = row.getIsExpanded();
        return (
          <div className="px-4 py-2">
            <div className="mb-2 flex items-center justify-between">
              {/* Kiri: label jumlah varian + Ubah sekaligus */}
              <div className="flex items-center gap-3">
                {/* <span className="text-xs text-muted-foreground">Menampilkan {variants.length} varian</span> */}
                <BulkVariantEditor variants={variants} />
              </div>
              {/* Kanan: Sembunyikan
              <button type="button" className="text-xs text-muted-foreground hover:underline whitespace-nowrap" onClick={row.getToggleExpandedHandler()} aria-expanded={isExpanded}>
                Sembunyikan
              </button> */}
            </div>

            {/* List varian dengan struktur seperti baris utama */}
            <div className="divide-y divide-dashed">
              {variants.map((v: any) => {
                const title = v.title ?? "Varian";
                const sku = v.sku ?? "-";
                const priceStr = typeof v.price !== "undefined" && v.price !== null ? formatPrice(Number(v.price), "IDR") : formatPrice(0, "IDR");
                const stockNum = Number(v.stock ?? 0);
                return (
                  <div key={v.id} className="flex items-center">
                    {/* Placeholder for Checkbox cell (size: 40px) + padding */}
                    <div className="w-[56px] flex-shrink-0"></div>

                    {/* Product cell */}
                    <div className="flex-1 flex items-center gap-3 py-2.5 pr-4">
                      {/* Placeholder for Image */}
                      <div className="h-10 w-10 flex-shrink-0"></div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{title}</div>
                        <div className="text-xs text-muted-foreground">SKU: {sku}</div>
                      </div>
                    </div>

                    {/* Performance cell */}
                    <div className="w-32 flex-shrink-0 py-2.5 pr-4 text-sm text-muted-foreground">--</div>

                    {/* Stock cell */}
                    <div className="w-24 flex-shrink-0 py-2.5 pr-4 text-left font-medium">{stockNum}</div>

                    {/* Price cell */}
                    <div className="w-48 flex-shrink-0 py-2.5 pr-4 text-left">
                      <div className="font-medium">{priceStr}</div>
                    </div>

                    {/* Status cell */}
                    <div className="w-28 flex-shrink-0 py-2.5 pr-4"></div>

                    {/* Actions cell (size: 80px) */}
                    <div className="w-[80px] flex-shrink-0 py-2.5"></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    >
      <DataTableToolbar table={table} />
      <ProductTableActionBar table={table} />
    </DataTable>
  );
}
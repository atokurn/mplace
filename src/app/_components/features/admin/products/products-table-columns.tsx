"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { Product } from "@/lib/db/schema";
import { ArrowUpDown, CircleDashed, DollarSign, Text, CheckCircle2, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface GetProductsTableColumnsProps {
  statusCounts: { active: number; inactive: number };
  categoryCounts: Record<string, number>;
  priceRange: { min: number; max: number };
}

export function getProductsTableColumns({
  statusCounts,
  categoryCounts,
  priceRange,
}: GetProductsTableColumnsProps): ColumnDef<Product>[] {
  // Build category options from counts map
  const categoryOptions = Object.entries(categoryCounts).map(([value, count]) => ({
    label: value,
    value,
    count,
  }));

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produk" />
      ),
      cell: ({ row }) => {
        const p: any = row.original as any;
        const imageUrl: string = p?.thumbnailUrl || p?.imageUrl || "/placeholder.svg";
        const variantCount: number = (p?.variantCount ?? (Array.isArray(p?.variants) ? p.variants.length : 0)) as number;
        const firstSku: string | null = Array.isArray(p?.variants) && p.variants.length > 0 ? (p.variants[0]?.sku ?? null) : null;
        const isExpandable = variantCount >= 3;
        const isExpanded = row.getIsExpanded();
        return (
          <div className="flex items-center gap-3 max-w-[40rem]">
            <Image
              src={imageUrl}
              alt={p?.title ?? "Product"}
              width={40}
              height={40}
              className="h-10 w-10 rounded object-cover"
            />
            <div className="min-w-0">
              <div className="truncate font-medium">{p?.title}</div>
              <div className="text-xs text-muted-foreground">
                ID: {p?.id}
                {firstSku ? <>
                  {" "}• SKU: {firstSku}
                </> : null}
              </div>
              {isExpandable ? (
                <button
                  type="button"
                  onClick={row.getToggleExpandedHandler()}
                  className="mt-1 inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? (
                    <ChevronDown className="mr-1 h-3 w-3" />
                  ) : (
                    <ChevronRight className="mr-1 h-3 w-3" />
                  )}
                  {variantCount} SKU
                </button>
              ) : null}
            </div>
          </div>
        );
      },
      meta: {
        label: "Title",
        placeholder: "Search titles...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => <div className="w-40 truncate">{row.getValue("category")}</div>,
      meta: {
        label: "Category",
        variant: "multiSelect",
        options: categoryOptions,
        icon: CircleDashed,
      },
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Harga jual" />
      ),
      cell: ({ row }) => {
        const p: any = row.original as any;
        const price = row.getValue<number>("price");
        const priceMin: number | undefined = typeof p?.priceMin === "number" ? p.priceMin : undefined;
        const priceMax: number | undefined = typeof p?.priceMax === "number" ? p.priceMax : undefined;
        const compareAtMin: number | null | undefined = typeof p?.compareAtMin === "number" ? p.compareAtMin : undefined;
        const compareAtMax: number | null | undefined = typeof p?.compareAtMax === "number" ? p.compareAtMax : undefined;

        const sellText = (() => {
          if (typeof priceMin === "number" && typeof priceMax === "number" && priceMin && priceMax) {
            if (priceMin !== priceMax) return `${formatPrice(priceMin, "IDR")} - ${formatPrice(priceMax, "IDR")}`;
            return formatPrice(priceMin, "IDR");
          }
          return typeof price === "number" ? formatPrice(price, "IDR") : String(price ?? "");
        })();

        const promoText = (() => {
          if (typeof compareAtMin === "number" && typeof compareAtMax === "number" && compareAtMin && compareAtMax) {
            if (compareAtMin !== compareAtMax) return `${formatPrice(compareAtMin, "IDR")} - ${formatPrice(compareAtMax, "IDR")}`;
            return formatPrice(compareAtMin, "IDR");
          }
          const originalPrice = p?.originalPrice as number | undefined;
          return typeof originalPrice === "number" ? formatPrice(originalPrice, "IDR") : undefined;
        })();

        return (
          <div className="w-48 text-right">
            <div className="font-medium">{sellText}</div>
            {promoText ? (
              <div className="text-xs text-muted-foreground">Promosi: {promoText}</div>
            ) : null}
          </div>
        );
      },
      meta: {
        label: "Price",
        variant: "range",
        range: [priceRange.min, priceRange.max],
        unit: "",
        icon: DollarSign,
      },
      enableColumnFilter: true,
      filterFn: "inNumberRange",
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ cell }) => {
        const isActive = cell.getValue<boolean>();
        const Icon = isActive ? CheckCircle2 : XCircle;
        return (
          <Badge variant={isActive ? "default" : "outline"} className="py-1 [&>svg]:size-3.5">
            <Icon />
            <span className="ml-1">{isActive ? "Active" : "Inactive"}</span>
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          { label: "Active", value: "true", count: statusCounts.active, icon: CheckCircle2 },
          { label: "Inactive", value: "false", count: statusCounts.inactive, icon: XCircle },
        ],
        icon: ArrowUpDown,
      },
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Date | string>();
        const d = typeof date === "string" ? new Date(date) : date;
        return <div className="w-40">{d ? d.toLocaleDateString() : ""}</div>;
      },
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => null,
      cell: () => null,
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
  ];
}
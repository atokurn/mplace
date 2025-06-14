"use client";

import type { Product } from "@/lib/db/schema";
import type { DataTableRowAction } from "@/types/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle2,
  Copy,
  DollarSign,
  Download,
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import type {
  getProductStatusCounts,
  getProductCategoryCounts,
  getProductPriceRange,
} from "@/app/_lib/queries/products";

interface GetProductsTableColumnsProps {
  statusCounts: Awaited<ReturnType<typeof getProductStatusCounts>>;
  categoryCounts: Awaited<ReturnType<typeof getProductCategoryCounts>>;
  priceRange: Awaited<ReturnType<typeof getProductPriceRange>>;

}

export function getProductsTableColumns({
  statusCounts,
  categoryCounts,
  priceRange,
}: Omit<GetProductsTableColumnsProps, 'setRowAction'>): ColumnDef<Product>[] {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Product Info",
      cell: ({ row }) => {
        const product = row.original;
        console.log({productCell: {title: product.title, id: product.id}});
        
        return (
          <div className="flex items-center space-x-2 min-w-0 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted cursor-pointer">
                    <Image
                      src={product.thumbnailUrl || product.imageUrl || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-3 max-w-xs">
                  <div className="space-y-3">
                    <div className="relative h-32 w-full rounded-md overflow-hidden">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="450px"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm leading-tight">{product.title}</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {product.fileSize && (
                          <div>File Size: <span className="font-medium">{formatFileSize(product.fileSize)}</span></div>
                        )}
                        {product.dimensions && (
                          <div>Dimensions: <span className="font-medium">{product.dimensions}</span></div>
                        )}
                        {product.fileFormat && (
                          <div>Format: <span className="font-medium">{product.fileFormat.toUpperCase()}</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate text-sm">{product.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {product.dimensions && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground mr-1">
                    {product.dimensions}
                  </span>
                )}
                {product.fileFormat && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mr-1">
                    {product.fileFormat.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: "includesString",
      meta: {
        variant: "text",
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <Badge variant="outline" className="capitalize">
            <Tag className="mr-1 h-3 w-3" />
            {category || "Uncategorized"}
          </Badge>
        );
      },
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
      meta: {
        variant: "multiSelect",
        options: categoryCounts && Object.keys(categoryCounts).length > 0 
          ? Object.keys(categoryCounts).map((category) => ({
              label: category || "Uncategorized",
              value: category || "uncategorized",
              count: categoryCounts[category] || 0,
            }))
          : [
              { label: "Templates", value: "Templates", count: 0 },
              { label: "Icons", value: "Icons", count: 0 },
              { label: "Fonts", value: "Fonts", count: 0 },
              { label: "Graphics", value: "Graphics", count: 0 },
            ],
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return (
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{formatPrice(price)}</span>
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: "inNumberRange",
      meta: {
        variant: "range",
        range: [priceRange?.min || 0, priceRange?.max || 1000],
      },
    },
    {
      accessorKey: "downloadCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Downloads
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const downloads = row.getValue("downloadCount") as number;
        return (
          <div className="flex items-center space-x-1">
            <Download className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{downloads.toLocaleString()}</span>
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: "inNumberRange",
      meta: {
        variant: "range",
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            ) : (
              <XCircle className="mr-1 h-3 w-3" />
            )}
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
      enableColumnFilter: true,
      filterFn: "arrIncludesSome",
      meta: {
        variant: "select",
        options: [
          {
            label: "Active",
            value: "true",
            count: statusCounts?.active || 0,
          },
          {
            label: "Inactive",
            value: "false",
            count: statusCounts?.inactive || 0,
          },
        ],
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateValue = row.getValue("createdAt");
        const date = dateValue ? new Date(dateValue as string) : null;
        return (
          <div className="text-sm text-muted-foreground">
            {date ? date.toLocaleDateString() : '-'}
          </div>
        );
      },
      enableColumnFilter: true,
      filterFn: "inDateRange",
      meta: {
        variant: "dateRange",
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(product.id);
                  toast.success("Product ID copied to clipboard");
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/products/${product.id}/delete`} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
  ];
}
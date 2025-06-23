"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { FloatingActionBar } from "@/components/data-table/floating-action-bar";
import { useDataTable } from "@/hooks/use-data-table";
import { type Product } from "@/lib/db/schema";
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
import { ProductTableActionBar } from "./ProductTableActionBar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Copy,
  Package,
  DollarSign,
  Activity,
  Tag,
  Download,
  Trash2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { formatPrice } from '@/lib/utils';

interface ProductTableClientProps {
  productsPromise: Promise<{
    data: Product[];
    pageCount: number;
  }>;
  categoryCounts?: Record<string, number>;
  priceRange?: { min: number; max: number } | null;
}

function createColumns(
  categoryOptions: { label: string; value: string; count: number }[],
  priceRange?: { min: number; max: number } | null
): ColumnDef<Product>[] {
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
      const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      return (
        <div className="flex items-center space-x-2 min-w-0 w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted cursor-pointer">
                  <Image
                    src={product.thumbnailUrl || product.imageUrl || '/placeholder.svg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="p-3 max-w-xs">
                <div className="space-y-3">
                  <div className="relative h-40 w-40 rounded-md overflow-hidden mx-auto">
                    <Image
                      src={product.imageUrl || '/placeholder.svg'}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="500px"
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
              {product.fileSize && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground mr-1">
                  {formatFileSize(product.fileSize)}
                </span>
              )}
              {!product.dimensions && !product.fileFormat && !product.fileSize && (
                <span className="text-muted-foreground">UNKNOWN</span>
              )}
            </div>
          </div>
        </div>
      );
    },
    meta: {
      label: "Product Info",
      placeholder: "Search products...",
      variant: "text",
      icon: Package,
    },
    enableColumnFilter: true,
    size: 300,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant="secondary" className="capitalize">
          {category || "Uncategorized"}
        </Badge>
      );
    },
    meta: {
      label: "Category",
      variant: "multiSelect",
      options: categoryOptions,
      icon: Tag,
    },
    enableColumnFilter: true,
    size: 120,
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <div className="font-medium">
          {formatPrice(price)}
        </div>
      );
    },
    meta: {
      label: "Price",
      variant: "range",
      range: [priceRange?.min || 0, priceRange?.max || 1000],
      unit: "$",
      icon: DollarSign,
    },
    enableColumnFilter: true,
    size: 100,
  },
  {
    id: "downloads",
    accessorKey: "downloadCount",
    header: "Downloads",
    cell: ({ row }) => {
      const downloads = row.getValue("downloads") as number;
      return (
        <div className="text-center">
          <Badge variant="outline">
            {downloads || 0}
          </Badge>
        </div>
      );
    },
    meta: {
      label: "Downloads",
      variant: "range",
      range: [0, 10000],
      unit: "",
      icon: Download,
    },
    enableColumnFilter: true,
    size: 100,
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
      icon: Activity,
    },
    enableColumnFilter: true,
    size: 100,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
    meta: {
      label: "Created At",
      variant: "dateRange",
      icon: Calendar,
    },
    enableColumnFilter: true,
    size: 120,
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
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href={`/product/${product.slug || product.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              navigator.clipboard.writeText(product.id);
              toast.success("Product ID copied to clipboard");
            }}>
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => {
                // TODO: Implement single delete with confirmation
                toast.error("Single delete not yet implemented. Use bulk delete.");
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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

export function ProductTableClient({ productsPromise, categoryCounts = {}, priceRange }: ProductTableClientProps) {
  const { data, pageCount } = React.use(productsPromise);
  
  // Generate category options from actual data
  const categoryOptions = React.useMemo(() => {
    const categories = new Set<string>();
    data.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).map(category => ({
      label: category,
      value: category,
      count: categoryCounts[category] || 0,
    }));
  }, [data, categoryCounts]);

  // Create columns with category options and price range
  const columns = React.useMemo(() => createColumns(categoryOptions, priceRange), [categoryOptions, priceRange]);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { left: ["select", "title"], right: ["actions"] },
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
        
        // Convert cellValue to string for comparison
        const cellValueStr = String(cellValue);
        return filterValue.some(val => cellValueStr === String(val));
      },
      includesString: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
      },
    },
  });



  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      
      <ProductTableActionBar table={table} categoryOptions={categoryOptions} />

    </div>
  );
}
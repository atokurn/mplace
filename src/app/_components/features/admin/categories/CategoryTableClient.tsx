"use client";

import React, { use, useTransition } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { useDataTable } from "@/hooks/use-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Download, 
  Plus,
  XCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { updateCategories, deleteCategories } from "@/app/_lib/actions/categories";
import type { SelectCategory } from "@/lib/db/schema";

type Category = SelectCategory & {
  productCount?: number;
};

interface CategoryTableClientProps {
  categoriesPromise: Promise<{
    data: Category[];
    pageCount: number;
  }>;
  statusCountsPromise: Promise<
    Array<{
      status: string;
      count: number;
    }>
  >;
}



const columns: ColumnDef<Category>[] = [
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
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Name",
      variant: "text",
      placeholder: "Filter by name...",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("description") || "No description"}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.getValue("slug")}
      </div>
    ),
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="text-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Category" 
              className="h-8 w-8 rounded object-cover mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-muted-foreground text-xs">No image</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "productCount",
    header: "Products",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("productCount")}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Products",
      variant: "number",
      placeholder: "Filter by product count...",
    },
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("sortOrder")}
      </div>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Sort Order",
      variant: "number",
      placeholder: "Filter by sort order...",
    },
  },
  {
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
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
    },
  },
  {
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
    enableColumnFilter: true,
    meta: {
      label: "Created Date",
      variant: "date",
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export function CategoryTableClient({ categoriesPromise, statusCountsPromise }: CategoryTableClientProps) {
  const { data, pageCount } = use(categoriesPromise);
  const statusCounts = use(statusCountsPromise);

  const [isPending, startTransition] = useTransition();

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { left: ["select", "name"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  });

  // Handler functions for bulk actions
  const onBulkStatusChange = (categories: Category[], isActive: boolean) => {
    startTransition(async () => {
      const result = await updateCategories({
        ids: categories.map(c => c.id),
        isActive,
      });
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${categories.length} categories updated to ${isActive ? 'active' : 'inactive'}`);
        table.toggleAllRowsSelected(false);
      }
    });
  };

  const onBulkDelete = (categories: Category[]) => {
    startTransition(async () => {
      const result = await deleteCategories({
        ids: categories.map(c => c.id),
      });
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${categories.length} categories deleted`);
        table.toggleAllRowsSelected(false);
      }
    });
  };

  const onBulkExport = (categories: Category[]) => {
    // TODO: Implement actual export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Description,Status,Created At\n" +
      categories.map(c => 
        `"${c.name}","${c.description || ''}","${c.isActive ? 'Active' : 'Inactive'}","${c.createdAt}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "categories.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${categories.length} categories exported`);
  };

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      
      {/* Floating Action Bar */}
      <DataTableActionBar table={table}>
        <DataTableActionBarSelection table={table} />
        <Separator
          orientation="vertical"
          className="hidden data-[orientation=vertical]:h-5 sm:block"
        />
        <div className="flex items-center gap-1.5">
          <DataTableActionBarAction
            size="icon"
            tooltip="Activate categories"
            disabled={isPending}
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              onBulkStatusChange(selectedRows, true);
            }}
          >
            <CheckCircle2 />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Deactivate categories"
            disabled={isPending}
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              onBulkStatusChange(selectedRows, false);
            }}
          >
            <XCircle />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Export categories"
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              if (selectedRows.length > 0) {
                onBulkExport(selectedRows);
              }
            }}
          >
            <Download />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Delete categories"
            disabled={isPending}
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              if (confirm(`Are you sure you want to delete ${selectedRows.length} categories? This action cannot be undone.`)) {
                onBulkDelete(selectedRows);
              }
            }}
          >
            <Trash2 />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>
    </div>
  );
}
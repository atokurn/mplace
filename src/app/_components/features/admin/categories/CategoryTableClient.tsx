"use client";

import React, { use, useTransition, useMemo, useCallback, useState } from "react";
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
import Image from "next/image";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Download, 
  XCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { updateCategories, deleteCategories, deleteCategory } from "@/app/_lib/actions/categories";
import type { ExtendedColumnSort } from "@/types/data-table";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

// Removed SelectCategory type import due to type inference issues; define a local structural type instead.
type Category = {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string | number | Date;
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



// Build columns with injected handlers to avoid referencing component-local variables at module scope
function getColumns(onDelete: (category: Category) => void): ColumnDef<Category>[] {
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
              <Image
                src={imageUrl}
                alt="Category image"
                width={32}
                height={32}
                className="h-8 w-8 rounded object-cover mx-auto"
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
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
      },
      filterFn: (row, id, value) => {
        if (!Array.isArray(value) || value.length === 0) return true;
        const cell = row.getValue(id);
        return value.includes(String(cell));
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const raw = row.getValue("createdAt") as string | number | Date;
        const date = new Date(raw);
        return (
          <div className="text-sm text-muted-foreground">
            {isNaN(date.getTime()) ? "-" : date.toLocaleDateString()}
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
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(category)}
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
    },
  ];
}

export function CategoryTableClient({ categoriesPromise, statusCountsPromise }: CategoryTableClientProps) {
  const { data, pageCount } = use(categoriesPromise);
  use(statusCountsPromise);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState<null | { type: "single" | "bulk"; categories: Category[] }>(null);

  const openConfirmSingle = useCallback((category: Category) => {
    if ((category.productCount ?? 0) > 0) {
      toast.warning("Kategori tidak dapat dihapus karena masih ada produk yang menggunakan kategori ini. Pindahkan produk ke kategori lain terlebih dahulu.");
      return;
    }
    setConfirmContext({ type: "single", categories: [category] });
    setConfirmOpen(true);
  }, []);

  const openConfirmBulk = useCallback((categories: Category[]) => {
    const hasUsed = categories.some(c => (c.productCount ?? 0) > 0);
    if (hasUsed) {
      toast.warning("Beberapa kategori tidak dapat dihapus karena masih digunakan oleh produk. Pindahkan produk ke kategori lain terlebih dahulu.");
      return;
    }
    setConfirmContext({ type: "bulk", categories });
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmContext) return;
    startTransition(async () => {
      if (confirmContext.type === "single") {
        const category = confirmContext.categories[0];
        const result = await deleteCategory({ id: category.id });
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(`Kategori "${category.name}" berhasil dihapus`);
          setConfirmOpen(false);
          router.refresh();
        }
      } else {
        const ids = confirmContext.categories.map(c => c.id);
        const result = await deleteCategories({ ids });
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(`${confirmContext.categories.length} kategori berhasil dihapus`);
          setConfirmOpen(false);
          // Clear selection after successful bulk delete
          table.toggleAllRowsSelected(false);
          router.refresh();
        }
      }
    });
  }, [confirmContext, router, startTransition]);

  const columns = useMemo(() => getColumns(openConfirmSingle), [openConfirmSingle]);

  const { table } = useDataTable<Category>({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: true,
    initialState: {
      sorting: ([{ id: "createdAt", desc: true }] as unknown as ExtendedColumnSort<Category>[]),
      columnPinning: { left: ["select", "name"] },
    },
  });

  const onBulkStatusChange = (categories: Array<{ id: string }>, isActive: boolean) => {
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
        router.refresh();
      }
    });
  };

  const onBulkDelete = (categories: Array<Category>) => {
    openConfirmBulk(categories);
  };

  const onBulkExport = (categories: Array<{ name: string; description?: string | null; isActive: boolean; createdAt: string | number | Date }>) => {
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
              onBulkExport(selectedRows);
            }}
          >
            <Download />
          </DataTableActionBarAction>
          <DataTableActionBarAction
            size="icon"
            tooltip="Delete categories"
            className="text-destructive"
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original as Category);
              openConfirmBulk(selectedRows);
            }}
          >
            <Trash2 />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>

      {/* Alert Dialog Confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmContext?.type === "bulk"
                ? `Hapus Kategori (${confirmContext.categories.length})`
                : "Hapus Kategori"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmContext?.type === "bulk"
                ? `Apakah Anda yakin ingin menghapus ${confirmContext.categories.length} kategori? Tindakan ini tidak dapat dibatalkan.`
                : confirmContext?.categories[0]
                  ? `Apakah Anda yakin ingin menghapus kategori "${confirmContext.categories[0].name}"? Tindakan ini tidak dapat dibatalkan.`
                  : "Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
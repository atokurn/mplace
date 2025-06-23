"use client";

import { type Product } from "@/lib/db/schema";
import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { CheckCircle2, Download, Tag, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateProducts, deleteProducts } from "@/app/_lib/actions/products";

const actions = [
  "update-status",
  "update-category",
  "export",
  "delete",
] as const;

type Action = (typeof actions)[number];

interface ProductTableActionBarProps {
  table: Table<Product>;
  categoryOptions: { label: string; value: string; count: number }[];
}

export function ProductTableActionBar({ 
  table, 
  categoryOptions 
}: ProductTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onProductUpdate = React.useCallback(
    ({
      field,
      value,
    }: {
      field: "status" | "category";
      value: boolean | string;
    }) => {
      setCurrentAction(
        field === "status" ? "update-status" : "update-category",
      );
      startTransition(async () => {
        let updateData: any;
        if (field === "status") {
          updateData = { isActive: value as boolean };
        } else {
          // Update category directly with the selected value
          updateData = { 
            category: value as string
          };
        }

        const { error } = await updateProducts({
          ids: rows.map((row) => row.original.id),
          ...updateData,
        });

        if (error) {
          toast.error(error);
          return;
        }
        
        const actionText = field === "status" 
          ? `Products ${value ? 'activated' : 'deactivated'}` 
          : `Category updated to ${value}`;
        toast.success(actionText);
      });
    },
    [rows, categoryOptions],
  );

  const onProductExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      const productsToExport = rows.map(row => ({
        id: row.original.id,
        title: row.original.title,
        category: row.original.category,
        price: row.original.price,
        status: row.original.isActive ? 'Active' : 'Inactive',
        downloads: row.original.downloadCount,
        createdAt: row.original.createdAt?.toISOString().split('T')[0] || '',
      }));
      
      const csvContent = [
        Object.keys(productsToExport[0]).join(','),
        ...productsToExport.map(product => Object.values(product).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    
      toast.success(`${productsToExport.length} products exported`);
    });
  }, [rows]);

  const onProductDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const { error } = await deleteProducts({
        ids: rows.map((row) => row.original.id),
      });

      if (error) {
        toast.error(error);
        return;
      }
      
      table.toggleAllRowsSelected(false);
      toast.success(
        `${rows.length} product${rows.length === 1 ? '' : 's'} deleted`
      );
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(value: string) =>
            onProductUpdate({ field: "status", value: value === "active" })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={getIsActionPending("update-status")}
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              <SelectItem value="active" className="capitalize">
                Active
              </SelectItem>
              <SelectItem value="inactive" className="capitalize">
                Inactive
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: string) =>
            onProductUpdate({ field: "category", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update category"
              isPending={getIsActionPending("update-category")}
            >
              <Tag />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {categoryOptions.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  className="capitalize"
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export products"
          isPending={getIsActionPending("export")}
          onClick={onProductExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete products"
          isPending={getIsActionPending("delete")}
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${rows.length} products? This action cannot be undone.`)) {
              onProductDelete();
            }
          }}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
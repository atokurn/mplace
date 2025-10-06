"use client";

import type { Table } from "@tanstack/react-table";
import { CheckCircle2, Download, Trash2, XCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { updateProducts, deleteProducts } from "@/app/_lib/actions/products";
import type { Product } from "@/lib/db/schema";

interface ProductTableActionBarProps {
  table: Table<Product>;
}

export function ProductTableActionBar({ table }: ProductTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();

  const onBulkStatusChange = React.useCallback(
    (isActive: boolean) => {
      startTransition(async () => {
        const ids = rows.map((row) => row.original.id);
        const { error } = await updateProducts({ ids, isActive });
        if (error) {
          toast.error(error);
          return;
        }
        table.toggleAllRowsSelected(false);
        toast.success(`${ids.length} product${ids.length === 1 ? '' : 's'} updated to ${isActive ? 'active' : 'inactive'}`);
      });
    },
    [rows, table]
  );

  const onBulkExport = React.useCallback(() => {
    startTransition(() => {
      const toExport = rows.map((row) => ({
        id: row.original.id,
        title: row.original.title,
        category: row.original.category,
        price: row.original.price,
        isActive: row.original.isActive,
        createdAt: row.original.createdAt,
      }));

      if (toExport.length === 0) {
        toast.info("No products selected to export");
        return;
      }

      const header = Object.keys(toExport[0]).join(",");
      const csv = [header, ...toExport.map((p) => Object.values(p).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${toExport.length} product${toExport.length === 1 ? '' : 's'} exported`);
    });
  }, [rows]);

  const onBulkDelete = React.useCallback(() => {
    startTransition(async () => {
      const ids = rows.map((row) => row.original.id);
      const { error } = await deleteProducts({ ids });
      if (error) {
        toast.error(error);
        return;
      }
      table.toggleAllRowsSelected(false);
      toast.success(`${ids.length} product${ids.length === 1 ? '' : 's'} deleted`);
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator orientation="vertical" className="mx-0.5 hidden h-5 md:block" />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Activate products"
          disabled={isPending}
          onClick={() => onBulkStatusChange(true)}
        >
          <CheckCircle2 />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Deactivate products"
          disabled={isPending}
          onClick={() => onBulkStatusChange(false)}
        >
          <XCircle />
        </DataTableActionBarAction>
        <DataTableActionBarAction size="icon" tooltip="Export products" onClick={onBulkExport}>
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete products"
          className="text-destructive/90 hover:text-destructive"
          onClick={onBulkDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
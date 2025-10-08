import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  renderSubRow?: (row: ReturnType<TanstackTable<TData>["getRowModel"]>["rows"][number]) => React.ReactNode;
  renderExpandTrigger?: (row: ReturnType<TanstackTable<TData>["getRowModel"]>["rows"][number]) => React.ReactNode;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  renderSubRow,
  renderExpandTrigger,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5", className)}
      {...props}
    >
      {children}
      <div className="overflow-auto rounded-md border">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "whitespace-nowrap",
                        header.column.getCanSort() && "cursor-pointer select-none"
                      )}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50"
                      aria-expanded={row.getIsExpanded() || undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap"
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* New expansion trigger row */}
                    {renderExpandTrigger ? (
                      <TableRow className="bg-background">
                        <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                          {renderExpandTrigger(row)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {row.getIsExpanded() && renderSubRow ? (
                      <TableRow className="bg-muted/30 hover:bg-muted/40">
                        <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                          {renderSubRow(row)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar}
      </div>
    </div>
  );
}

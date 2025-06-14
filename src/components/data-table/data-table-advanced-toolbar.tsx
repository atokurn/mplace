"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { X, Download, Filter, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import type { DataTableFilterField } from "@/lib/filter-columns";
import { cn } from "@/lib/utils";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  exportData?: boolean;
  children?: React.ReactNode;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterFields = [],
  exportData = false,
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Handle export functionality
  const handleExport = React.useCallback(() => {
    const data = table.getFilteredRowModel().rows.map(row => row.original);
    const csv = convertToCSV(data);
    downloadCSV(csv, 'products-export.csv');
  }, [table]);



  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Global search */}
          <Input
            placeholder="Search products..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          
          {/* Faceted filters */}
          {filterFields.map((field) => {
            const column = table.getColumn(field.value as string);
            if (!column) return null;
            
            // Show faceted filter for fields with options (multiSelect, select)
            if (field.variant === 'multiSelect' || field.variant === 'select') {
              if (!field.options) return null;
              
              return (
                <DataTableFacetedFilter
                  key={field.value as string}
                  column={column}
                  title={field.label}
                  options={field.options}
                  multiple={field.variant === 'multiSelect'}
                />
              );
            }
            
            // Show date filter for dateRange variant
            if (field.variant === 'dateRange') {
              return (
                <DataTableDateFilter
                  key={field.value as string}
                  column={column}
                  title={field.label}
                  multiple={true}
                />
              );
            }
            
            return null;
          })}
          
          {/* Clear filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {/* Custom children */}
          {children}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Export button */}
          {exportData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          
          {/* View options */}
          <DataTableViewOptions table={table} />
        </div>
      </div>

    </div>
  );
}

// Utility functions for CSV export
function convertToCSV(data: any[]): string {
  if (!data.length || !data[0]) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

"use client";

import { DataTable } from "../../../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../../../components/data-table/data-table-toolbar";
import { useDataTable } from "../../../../../hooks/use-data-table";
import { UserTableActionBar } from "./UserTableActionBar";
import * as React from "react";
import { createColumns, type PublicUser } from "./usertable-columns";


interface UserTableClientProps {
  usersPromise: Promise<{
    data: PublicUser[];
    pageCount: number;
  }>;
  roleCounts?: { admin: number; user: number };
}

export function UserTableClient({ usersPromise, roleCounts }: UserTableClientProps) {
  const { data, pageCount } = React.use(usersPromise)

  const columns = React.useMemo(() => createColumns(roleCounts), [roleCounts])

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { left: ["select", "name"], right: ["actions"] },
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
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <UserTableActionBar table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
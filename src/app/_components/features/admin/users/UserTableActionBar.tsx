"use client";

import type { Table } from "@tanstack/react-table";
import { UserCheck, Download, Trash2 } from "lucide-react";
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
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateUsers, deleteUsers } from "@/app/_lib/actions/users";
import type { PublicUser } from "./usertable-columns";

// Remove const assertion that isn't used as a type elsewhere
// const actions = ["update-role", "export", "delete"] as const;
//
// Derive type directly from runtime array to avoid unused-type lint
// type Action = (typeof actions)[number];
// Define action union type directly to avoid unused runtime arrays
type Action = "update-role" | "export" | "delete";

interface UserTableActionBarProps {
  table: Table<PublicUser>;
}

export function UserTableActionBar({ table }: UserTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onUserUpdate = React.useCallback(
    (value: string) => {
      setCurrentAction("update-role");
      startTransition(async () => {
        const { error } = await updateUsers({
          ids: rows.map((row) => row.original.id),
          role: value as "user" | "admin",
        });

        if (error) {
          toast.error(error);
          return;
        }

        toast.success(`Role updated to ${value}`);
      });
    },
    [rows],
  );

  const onUserExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      const usersToExport = rows.map(row => ({
        id: row.original.id,
        name: row.original.name,
        email: row.original.email,
        role: row.original.role,
        joinedAt: row.original.createdAt?.toISOString().split('T')[0] || '',
        lastUpdated: row.original.updatedAt?.toISOString().split('T')[0] || '',
      }));

      const csvContent = [
        Object.keys(usersToExport[0]).join(','),
        ...usersToExport.map(user => Object.values(user).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`${usersToExport.length} users exported`);
    });
  }, [rows]);

  const onUserDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const { error } = await deleteUsers({
        ids: rows.map((row) => row.original.id),
      });

      if (error) {
        toast.error(error);
        return;
      }

      table.toggleAllRowsSelected(false);
      toast.success(
        `${rows.length} user${rows.length === 1 ? '' : 's'} deleted`
      );
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="mx-0.5 hidden h-5 md:block"
      />
      <div className="flex items-center gap-1.5">
        <Select onValueChange={onUserUpdate}>
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update role"
              isPending={getIsActionPending("update-role")}
            >
              <UserCheck />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export users"
          isPending={getIsActionPending("export")}
          onClick={onUserExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete users"
          className="text-destructive/90 hover:text-destructive"
          onClick={onUserDelete}
          isPending={getIsActionPending("delete")}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
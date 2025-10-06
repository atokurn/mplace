import Link from "next/link";
import { Plus } from "lucide-react";
import * as React from "react";
import { Metadata } from "next";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/app/_components/shared/layouts/shell";
import { Button } from "@/components/ui/button";

import type { SearchParams } from "@/types";

import { UserTableServer } from "@/app/_components/features/admin/users/UserTableServer";
// removed unused import usersSearchParamsCache

interface UsersPageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users and their roles",
};

export default async function UsersPage(props: UsersPageProps) {
  const searchParams = await props.searchParams;

  return (
    <Shell variant="sidebar" className="gap-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage users and their roles
            </p>
          </div>
          <Button asChild>
            <Link href="/users/add">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              filterCount={3}
              cellWidths={[
                "10rem",
                "20rem",
                "10rem",
                "12rem",
                "12rem",
                "8rem",
              ]}
              withPagination
              shrinkZero
            />
          }
        >
          <UserTableServer searchParams={searchParams} />
        </React.Suspense>
      </div>
    </Shell>
  );
}
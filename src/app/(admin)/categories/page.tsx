import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoryTableServer } from "@/app/_components/features/admin/categories/CategoryTableServer";
import { Shell } from "@/app/_components/shared/layouts/shell";
import { Button } from "@/components/ui/button";
import type { SearchParams } from "@/types";

interface CategoriesPageProps {
  searchParams: SearchParams;
}

export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Organize your products with categories
            </p>
          </div>
          <Button asChild>
            <Link href="/categories/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
        <CategoryTableServer searchParams={searchParams} />
      </div>
    </Shell>
  );
}
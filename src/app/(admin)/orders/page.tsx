import * as React from "react";
import { OrderTableWrapper } from "@/app/_components/features/admin/orders/OrderTableWrapper";
import { Shell } from "@/app/_components/shared/layouts/shell";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
    sort?: string;
    orderNumber?: string;
    status?: string;
    paymentStatus?: string;
    operator?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolved = await searchParams;
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and transactions
          </p>
        </div>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={8}
              filterCount={4}
              cellWidths={[
                "3rem",
                "10rem",
                "15rem",
                "10rem",
                "8rem",
                "8rem",
                "12rem",
                "3rem",
              ]}
              shrinkZero
            />
          }
        >
          <OrderTableWrapper searchParams={resolved} />
        </React.Suspense>
      </div>
    </Shell>
  );
}
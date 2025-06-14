import * as React from "react";
import { DashboardOverview } from "@/app/_components/features/admin/dashboard/DashboardOverview";
import { Shell } from "@/app/_components/shared/layouts/shell";
import { getDashboardAnalytics } from "@/app/_lib/queries/dashboard";

export default async function DashboardPage() {
  let dashboardData = null;
  try {
    dashboardData = await getDashboardAnalytics();
  } catch (error) {
    console.error("Failed to fetch dashboard analytics:", error);
    // dashboardData will remain null, DashboardOverview will handle it
  }

  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your marketplace performance
          </p>
        </div>
        <DashboardOverview initialData={dashboardData} />
      </div>
    </Shell>
  );
}
import * as React from "react";
import { AnalyticsChart } from "@/app/_components/features/admin/analytics/AnalyticsChart";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function AnalyticsPage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your marketplace performance and insights
          </p>
        </div>
        <AnalyticsChart />
      </div>
    </Shell>
  );
}
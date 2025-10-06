import * as React from "react";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function PromotionsPage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
            <p className="text-muted-foreground">
              Manage discount codes, campaigns, and bundles
            </p>
          </div>
        </div>
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Coming soon: Promotions management and campaign analytics.
        </div>
      </div>
    </Shell>
  );
}
import * as React from "react";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function FinancePage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Financial overview and configuration
          </p>
        </div>
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Navigate to Transactions to view detailed records.
        </div>
      </div>
    </Shell>
  );
}
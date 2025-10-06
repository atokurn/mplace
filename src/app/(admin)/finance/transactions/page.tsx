import * as React from "react";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function TransactionsPage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and reconcile financial transactions
          </p>
        </div>
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Coming soon: Transactions list, filters, and reconciliation tools.
        </div>
      </div>
    </Shell>
  );
}
import * as React from "react";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function ReturnsPage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage returns</h1>
          <p className="text-muted-foreground">
            Handle return requests and RMA workflows
          </p>
        </div>
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Coming soon: Returns management table and workflows.
        </div>
      </div>
    </Shell>
  );
}
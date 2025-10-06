import * as React from "react";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function FulfillmentSettingsPage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fulfillment settings</h1>
          <p className="text-muted-foreground">
            Configure fulfillment providers and automation
          </p>
        </div>
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Coming soon: Fulfillment providers and automation settings.
        </div>
      </div>
    </Shell>
  );
}
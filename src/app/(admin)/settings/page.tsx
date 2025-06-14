import * as React from "react";
import { SettingsForm } from "@/app/_components/features/admin/settings/SettingsForm";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function SettingsPage() {
  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your marketplace settings and preferences
          </p>
        </div>
        <SettingsForm />
      </div>
    </Shell>
  );
}
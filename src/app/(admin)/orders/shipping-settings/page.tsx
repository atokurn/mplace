import * as React from "react";
import { Shell } from "@/app/_components/shared/layouts/shell";

export default function ShippingSettingsPage() {
  const missing: string[] = [
    !process.env.RAJAONGKIR_API_KEY ? "RAJAONGKIR_API_KEY" : "",
    !process.env.RAJAONGKIR_BASE_URL ? "RAJAONGKIR_BASE_URL" : "",
  ].filter(Boolean);
  const isConfigured = missing.length === 0;

  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping settings</h1>
          <p className="text-muted-foreground">
            Configure shipping carriers, zones, and rates
          </p>
        </div>

        {!isConfigured && (
          <div className="rounded-lg border p-4 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
            <div className="font-medium">RajaOngkir belum dikonfigurasi</div>
            <p className="text-sm mt-1">
              Set environment variables berikut di .env.local: {missing.join(", ")}
            </p>
            <p className="text-sm mt-2">
              Contoh: RAJAONGKIR_BASE_URL=https://api.rajaongkir.com/starter (atau /basic, /pro) dan RAJAONGKIR_API_KEY=your_api_key
            </p>
          </div>
        )}

        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Coming soon: Shipping zones, carriers, rates configuration UI.
        </div>
      </div>
    </Shell>
  );
}
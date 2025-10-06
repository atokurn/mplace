"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn, formatNumber } from "@/lib/utils";

export default function CostPriceCard() {
  const [manual, setManual] = React.useState(false);
  const [basePrice, setBasePrice] = React.useState<string>("");
  const [costPrice, setCostPrice] = React.useState<string>("");

  React.useEffect(() => {
    if (!manual) {
      const priceNum = parseFloat(basePrice || "0");
      const calculated = priceNum * 0.8; // example formula
      setCostPrice(isNaN(calculated) ? "" : String(calculated));
    }
  }, [manual, basePrice]);

  return (
    <Card id="cost" className="rounded-lg border p-6 bg-background space-y-6">
      <h2 className="text-base font-semibold">Harga Modal</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium">Harga jual</Label>
          <Input value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="Contoh: 100000" />
        </div>
        <div>
          <Label className="text-sm font-medium">Harga modal (otomatis)</Label>
          <Input value={costPrice} onChange={(e) => setCostPrice(e.target.value)} disabled={!manual} placeholder="Contoh: 80000" />
        </div>
        <div className="flex items-end">
          <div className="flex items-center gap-2">
            <Switch checked={manual} onCheckedChange={setManual} />
            <span className="text-sm">Atur manual</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">Harga modal saat ini: {costPrice ? `Rp ${formatNumber(Number(costPrice))}` : '-'}</div>
    </Card>
  );
}
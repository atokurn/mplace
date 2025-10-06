"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function SkuMappingCard() {
  const [enabled, setEnabled] = React.useState(false);
  const [mode, setMode] = React.useState<string>("all");
  const [channels, setChannels] = React.useState<Record<string, boolean>>({ Shopee: false, Tokopedia: false, TikTok: false });

  const toggleChannel = (name: string, value: boolean) => {
    setChannels((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card id="sku-mapping" className="rounded-lg border p-6 bg-background space-y-6">
      <h2 className="text-base font-semibold">SKU Mapping</h2>
      <div className="flex items-center justify-between">
        // Replace remaining FormLabel with Label
        <Label className="text-sm font-medium">Aktifkan SKU Mapping</Label>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Mode pemetaan</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua channel</SelectItem>
                <SelectItem value="by_channel">Per channel</SelectItem>
                <SelectItem value="by_store">Per toko</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(mode === 'by_channel' || mode === 'all') && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Channel</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(channels).map((ch) => (
                  <label key={ch} className="flex items-center gap-2">
                    <Checkbox checked={channels[ch]} onCheckedChange={(v) => toggleChannel(ch, Boolean(v))} />
                    <span className="text-sm">{ch}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
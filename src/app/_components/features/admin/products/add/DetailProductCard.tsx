"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DetailProductCard() {
  return (
    <Card id="detail" className="rounded-lg border p-6 bg-background space-y-6">
      <h2 className="text-base font-semibold">Detail produk</h2>
      <div>
        <Label className="text-sm font-medium">Deskripsi</Label>
        <Textarea placeholder="Masukkan deskripsi produk" className="min-h-[120px] bg-background border-border resize-none" />
      </div>
    </Card>
  );
}
"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DetailProductCardProps {
  onDescriptionChange?: (description: string) => void;
  initialDescription?: string;
}

export default function DetailProductCard({ onDescriptionChange, initialDescription }: DetailProductCardProps) {
  // Prefill parent on mount if initialDescription provided
  React.useEffect(() => {
    if (initialDescription) {
      onDescriptionChange?.(initialDescription);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card id="detail" className="rounded-lg border p-6 bg-background space-y-6">
      <h2 className="text-base font-semibold">Detail produk</h2>
      <div>
        <Label className="text-sm font-medium">Deskripsi</Label>
        <Textarea
          placeholder="Masukkan deskripsi produk"
          className="min-h-[120px] bg-background border-border resize-none"
          defaultValue={initialDescription ?? ""}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
        />
      </div>
    </Card>
  );
}
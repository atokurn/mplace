"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavCardProps {
  sections: { id: string; label: string }[];
  previewTitle?: string;
  previewCategory?: string;
  previewImage?: string;
  previewTags?: string[];
}

export default function NavCard({ sections, previewTitle, previewCategory, previewImage, previewTags = [] }: NavCardProps) {
  return (
    <aside className="space-y-4 sticky top-20 self-start">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground mb-3">
          Melengkapi informasi produk bisa membantu meningkatkan eksposur produk.
        </div>
        <nav className="space-y-1">
          {sections.map((s) => (
            <Button
              key={s.id}
              type="button"
              variant="ghost"
              className="w-full justify-start text-left text-sm"
              onClick={() => {
                const el = document.getElementById(s.id);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {s.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Preview card */}
      <div className="rounded-lg border overflow-hidden bg-background">
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
          {previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="text-xs text-muted-foreground">Tambahkan gambar</div>
          )}
        </div>
        <div className="p-4 space-y-1">
          <div className="font-medium truncate">{previewTitle || 'Nama produk'}</div>
          <div className="text-sm text-muted-foreground">{previewCategory || 'Kategori'}</div>
          <div className="flex flex-wrap gap-1 pt-1">
            {Array.isArray(previewTags) && previewTags.map((tag: string, i: number) => (
              <Badge key={`${tag}-${i}`} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
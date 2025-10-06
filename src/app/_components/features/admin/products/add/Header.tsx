"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface AddHeaderProps {
  onCancel?: () => void;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
}

export default function AddHeader({ onCancel, onSaveDraft, onSubmit }: AddHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-base md:text-lg font-semibold">Tambah Produk</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSaveDraft} type="button">Simpan sebagai draf</Button>
          <Button variant="outline" onClick={onCancel} type="button">Batal</Button>
          <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700" type="button">Simpan</Button>
        </div>
      </div>
    </div>
  );
}
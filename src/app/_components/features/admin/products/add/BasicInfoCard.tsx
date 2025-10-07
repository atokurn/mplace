"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllCategories } from "@/app/_lib/queries/categories";

interface CategoryOption { id: string; name: string }

interface BasicInfoCardProps {
  onPreviewTitleChange?: (title: string) => void;
  onPreviewCategoryChange?: (category: string) => void;
  onPreviewImageChange?: (url: string) => void;
  onSelectedCategoryIdChange?: (id: string) => void;
  onMainImageFileChange?: (file: File) => void;
  // Non-visual callbacks
  onPreviewImagesChange?: (urls: string[]) => void;
  onMetaTitleChange?: (metaTitle: string) => void;
}

export default function BasicInfoCard({ onPreviewTitleChange, onPreviewCategoryChange, onPreviewImageChange, onSelectedCategoryIdChange, onMainImageFileChange, onPreviewImagesChange, onMetaTitleChange }: BasicInfoCardProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const categoriesData = await getAllCategories();
        const simplified: CategoryOption[] = categoriesData.map(({ id, name }: CategoryOption) => ({ id, name }));
        setCategories(simplified);
      } catch {
        toast.error("Gagal memuat kategori");
      }
    })();
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Silakan pilih file gambar');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    onPreviewImageChange?.(imageUrl);
    toast.success('Gambar diunggah');
  };

  // Images section state
  const labels = [
    "Depan",
    "Samping",
    "Berbagai sisi",
    "Saat diguna...",
    "Variasi",
    "Dengan latar...",
    "Close-up",
    "Ukuran & Sk...",
  ];
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [isDraggingMain, setIsDraggingMain] = useState<boolean>(false);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<Record<string, string | null>>(
    () => Object.fromEntries(labels.map((l) => [l, null]))
  );
  // Track uploaded remote URLs corresponding to additional image tiles
  const [additionalImageRemoteUrls, setAdditionalImageRemoteUrls] = useState<Record<string, string | null>>(
    () => Object.fromEntries(labels.map((l) => [l, null]))
  );
  const [isDraggingAdditional, setIsDraggingAdditional] = useState<string | null>(null);
  // Tambahan: state dan utilitas untuk reorder gambar
  const [reorderDraggingFrom, setReorderDraggingFrom] = useState<string | null>(null);
  const urlRegistryRef = useRef<Set<string>>(new Set());

  // Validasi gambar: ukuran maksimum dan dimensi minimum
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MIN_IMAGE_DIMENSION = 600; // 600px
  const validateImageFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar");
      return null;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Ukuran file melebihi 5 MB");
      return null;
    }
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      const { w, h } = await new Promise<{ w: number; h: number }>((resolve, reject) => {
        img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
        img.onerror = () => reject(new Error("load_error"));
        img.src = url;
      });
      if (w < MIN_IMAGE_DIMENSION || h < MIN_IMAGE_DIMENSION) {
        toast.error(`Dimensi gambar minimal ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px`);
        URL.revokeObjectURL(url);
        return null;
      }
      // Track URL untuk dibersihkan saat unmount
      urlRegistryRef.current.add(url);
      return url;
    } catch {
      toast.error("Gagal memuat gambar");
      URL.revokeObjectURL(url);
      return null;
    }
  };
  const swapPreviews = (fromKey: string, toKey: string) => {
    if (fromKey === toKey) return;
    const fromVal = fromKey === "__main__" ? mainImagePreview : additionalImagePreviews[fromKey];
    const toVal = toKey === "__main__" ? mainImagePreview : additionalImagePreviews[toKey];

    // Hitung nilai gambar utama baru setelah swap
    const newMain = toKey === "__main__" ? fromVal : fromKey === "__main__" ? toVal : mainImagePreview;

    // Lakukan swap tanpa merevoke object URL (agar tidak merusak preview saat reorder)
    if (toKey === "__main__") setMainImagePreview(fromVal || null);
    if (fromKey === "__main__") setMainImagePreview(toVal || null);

    setAdditionalImagePreviews((s) => {
      const ns = { ...s };
      if (fromKey !== "__main__") ns[fromKey] = toVal || null;
      if (toKey !== "__main__") ns[toKey] = fromVal || null;
      return ns;
    });

    // Sinkronkan remote URL mapping jika reorder antar tiles tambahan
    if (fromKey !== "__main__" && toKey !== "__main__") {
      setAdditionalImageRemoteUrls((prev) => {
        const next = { ...prev };
        const tmp = next[fromKey] ?? null;
        next[fromKey] = next[toKey] ?? null;
        next[toKey] = tmp;
        // Update parent dengan urutan terbaru
        onPreviewImagesChange?.(labels.map((l) => next[l]).filter((u): u is string => !!u));
        return next;
      });
    }

    // Sinkronkan external preview jika gambar utama berubah karena reorder
    if (newMain !== mainImagePreview) {
      onPreviewImageChange?.(newMain || "");
    }
  };
  const onDragStartMain = (e: React.DragEvent) => {
    if (!mainImagePreview) return;
    setReorderDraggingFrom("__main__");
    e.dataTransfer.setData("text/plain", "__main__");
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragStartAdditional = (e: React.DragEvent, label: string) => {
    if (!additionalImagePreviews[label]) return;
    setReorderDraggingFrom(label);
    e.dataTransfer.setData("text/plain", label);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEndReorder = () => setReorderDraggingFrom(null);
  const onMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await validateImageFile(file);
    if (!url) return;
    // Jangan revoke ObjectURL lama saat upload; bisa masih dipakai di tile lain setelah reorder
    setMainImagePreview(url);
    onPreviewImageChange?.(url);
    onMainImageFileChange?.(file);
  };

  const isUrlInUse = (url: string, exceptKey?: string): boolean => {
    if (!url) return false;
    // Cek main image (kecuali jika exceptKey adalah '__main__')
    if (exceptKey !== "__main__" && mainImagePreview === url) return true;
    // Cek semua additional tiles (kecuali label yang di-exclude)
    for (const [label, val] of Object.entries(additionalImagePreviews)) {
      if (label === exceptKey) continue;
      if (val === url) return true;
    }
    return false;
  };

  const onRemoveMainImage = () => {
    const prev = mainImagePreview;
    if (prev && !isUrlInUse(prev, "__main__")) URL.revokeObjectURL(prev);
    // Pastikan gambar utama tidak kosong jika ada gambar tambahan
    const firstAdditional = labels.find((l) => additionalImagePreviews[l]);
    if (firstAdditional) {
      const imgUrl = additionalImagePreviews[firstAdditional]!;
      setMainImagePreview(imgUrl);
      setAdditionalImagePreviews((s) => ({ ...s, [firstAdditional]: null }));
      onPreviewImageChange?.(imgUrl);
      return;
    }
    setMainImagePreview(null);
    onPreviewImageChange?.("");
  };

  const onDragEnterMain = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMain(true);
  };
  const onDragLeaveMain = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMain(false);
  };
  const onDragOverMain = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDropMain = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMain(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = await validateImageFile(file);
      if (!url) return;
      // Jangan revoke langsung; biarkan unmount cleanup
      setMainImagePreview(url);
      onPreviewImageChange?.(url);
      return;
    }
    const fromKey = e.dataTransfer.getData("text/plain");
    if (fromKey) swapPreviews(fromKey, "__main__");
  };

  // Upload image to server and store remote URL for the given tile label (scoped inside component)
  const uploadAdditionalImage = async (label: string, file: File) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        let errMsg = "Gagal mengunggah gambar tambahan";
        try {
          const errJson = await res.json();
          errMsg = errJson?.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      const upload = await res.json();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const imageUrlAbs = origin ? `${origin}${upload.url}` : upload.url;
      setAdditionalImageRemoteUrls((prev) => {
        const next = { ...prev, [label]: imageUrlAbs };
        // Push flattened list of URLs to parent (order by labels)
        onPreviewImagesChange?.(labels.map((l) => next[l]).filter((u): u is string => !!u));
        return next;
      });
      toast.success("Gambar tambahan diunggah");
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengunggah gambar tambahan");
    }
  };
  const onAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await validateImageFile(file);
    if (!url) return;
    // Jangan revoke langsung pada tile ini; URL lama mungkin dipakai di tempat lain setelah reorder
    setAdditionalImagePreviews((s) => ({ ...s, [label]: url }));
    // Upload to server and notify parent with remote URL
    await uploadAdditionalImage(label, file);
  };

  const onRemoveAdditionalImage = (label: string) => {
    const prev = additionalImagePreviews[label];
    if (prev && !isUrlInUse(prev, label)) URL.revokeObjectURL(prev);
    setAdditionalImagePreviews((s) => ({ ...s, [label]: null }));
    // Also clear remote URL and update parent
    setAdditionalImageRemoteUrls((prev) => {
      const next = { ...prev, [label]: null };
      onPreviewImagesChange?.(labels.map((l) => next[l]).filter((u): u is string => !!u));
      return next;
    });
  };

  const onDragEnterAdditional = (e: React.DragEvent, label: string) => {
    e.preventDefault();
    setIsDraggingAdditional(label);
  };
  const onDragLeaveAdditional = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAdditional(null);
  };
  const onDragOverAdditional = (e: React.DragEvent, _label: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDropAdditional = async (e: React.DragEvent, label: string) => {
    e.preventDefault();
    setIsDraggingAdditional(null);

    // If a file is dropped, treat as upload
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = await validateImageFile(file);
      if (!url) return;
      // Jangan revoke langsung; biarkan unmount cleanup
      setAdditionalImagePreviews((s) => ({ ...s, [label]: url }));
      // Upload ke server dan kabari parent
      await uploadAdditionalImage(label, file);
      return;
    }

    // Otherwise, handle reorder drop (drag from another tile or main image)
    const fromKey = e.dataTransfer.getData("text/plain");
    if (fromKey) swapPreviews(fromKey, label);
  }

  // Cleanup object URLs hanya saat unmount
  useEffect(() => {
    return () => {
      urlRegistryRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlRegistryRef.current.clear();
    };
  }, []);
  return (
    <Card id="basic" className="rounded-lg border p-6 bg-background space-y-6">
      <h2 className="text-base font-semibold">Informasi dasar</h2>

      {/* Product Images */}
      <div className="space-y-2 max-w-3xl mx-auto">
        <Label htmlFor="product-image" className="flex items-center">
          <span className="text-red-500 mr-1">*</span>Gambar
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Image Upload with Drag & Drop */}
          <div
            className={cn(
              "md:col-span-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-0 aspect-square text-center hover:border-primary cursor-pointer bg-muted/20",
              isDraggingMain ? "border-primary bg-primary/5 ring-2 ring-primary" : "",
              mainImagePreview ? "relative" : ""
            )}
            onDragEnter={onDragEnterMain}
            onDragLeave={onDragLeaveMain}
            onDragOver={onDragOverMain}
            onDrop={onDropMain}
            onClick={() => document.getElementById("main-image-upload")?.click()}
            draggable={!!mainImagePreview}
            onDragStart={onDragStartMain}
            onDragEnd={onDragEndReorder}
          >
            {mainImagePreview ? (
              <>
                <img src={mainImagePreview} alt="Preview" className="object-contain w-full h-full rounded-md" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMainImage();
                  }}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Unggah gambar utama</span>
                <p className="text-xs text-muted-foreground mt-1">
                  - Dimensi: 600 x 600 px.<br />- Ukuran file maks.: 5 MB.<br />- Format: JPG, JPEG, PNG.<br />- Seret & lepas gambar di sini
                </p>
              </>
            )}
            {/* Hidden file input */}
            <Input id="main-image-upload" type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={onMainImageChange} />
            {isDraggingMain && (
              <div className="absolute inset-0 rounded-lg ring-2 ring-primary bg-primary/10 grid place-items-center pointer-events-none">
                <span className="text-xs font-medium">Lepas untuk menukar</span>
              </div>
            )}
          </div>
          {/* Additional Image Placeholders with Drag & Drop */}
          <div className="md:col-span-2 grid grid-cols-4 gap-2">
            {labels.map((label) => (
              <div
                key={label}
                className={cn(
                  "border rounded-lg flex flex-col items-center justify-center p-0 aspect-square bg-muted/50 text-center cursor-pointer hover:border-primary",
                  isDraggingAdditional === label ? "border-primary bg-primary/5 ring-2 ring-primary" : "",
                  additionalImagePreviews[label] ? "relative" : ""
                )}
                onDragEnter={(e) => onDragEnterAdditional(e, label)}
                onDragLeave={onDragLeaveAdditional}
                onDragOver={(e) => onDragOverAdditional(e, label)}
                onDrop={(e) => onDropAdditional(e, label)}
                onClick={() => document.getElementById(`image-upload-${label}`)?.click()}
                draggable={!!additionalImagePreviews[label]}
                onDragStart={(e) => onDragStartAdditional(e, label)}
                onDragEnd={onDragEndReorder}
              >
                {additionalImagePreviews[label] ? (
                  <>
                    <img src={additionalImagePreviews[label] || ""} alt={label} className="object-contain w-full h-full rounded-md" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAdditionalImage(label);
                      }}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
                  </>
                )}
                {/* Hidden file input for each */}
                <Input id={`image-upload-${label}`} type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => onAdditionalImageChange(e, label)} />
                {isDraggingAdditional === label && (
                  <div className="absolute inset-0 rounded-lg ring-2 ring-primary bg-primary/10 grid place-items-center pointer-events-none">
                    <span className="text-[10px] font-medium">Lepas untuk menukar</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product name */}
      <div>
        <Label className="text-sm font-medium">Nama produk</Label>
        <Input placeholder="Contoh: T-shirt" className="bg-background border-border text-sm" onChange={(e) => { onPreviewTitleChange?.(e.target.value); onMetaTitleChange?.(e.target.value); }} />
      </div>

      {/* Category */}
      <div>
        <Label className="text-sm font-medium">Kategori</Label>
        <Select onValueChange={(value) => {
          const selected = categories.find((cat) => cat.id === value);
          if (selected) onPreviewCategoryChange?.(selected.name);
          onSelectedCategoryIdChange?.(value);
        }}>
          <SelectTrigger className="bg-background border-border w-full">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
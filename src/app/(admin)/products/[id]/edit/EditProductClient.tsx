"use client";

import * as React from "react";
import {
  AddHeader,
  NavCard,
  BasicInfoCard,
  DetailProductCard,
  SalesInfoCard,
  ShippingCard,
  VariantsEditor,
} from "@/app/_components/features/admin/products/add";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProduct, updateVariants } from "@/app/_lib/actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/utils/slug";
import type { SelectProduct } from "@/lib/db/schema";

interface VariantOption {
  id: string;
  value: string;
  charCount: number;
  image?: File | null;
}

interface VariantItem {
  id: string;
  name: string;
  options: VariantOption[];
}

interface VariantCombinationData {
  combinationId: string;
  options: Record<string, string>;
  price: string;
  quantity: string;
  sku: string;
  weight: string;
  weightUnit: "g" | "kg";
}

interface EditProductClientProps {
  product: SelectProduct;
}

export default function EditProductClient({ product }: EditProductClientProps) {
  const sections = [
    { id: "basic", label: "Informasi dasar" },
    { id: "detail", label: "Detail produk" },
    { id: "sales", label: "Info penjualan" },
    { id: "shipping", label: "Pengiriman" },
    { id: "sku-mapping", label: "SKU Mapping" },
  ];

  const [previewTitle, setPreviewTitle] = React.useState<string>(product.title ?? "");
  const [previewCategory, setPreviewCategory] = React.useState<string>(product.category ?? "");
  const [previewImage, setPreviewImage] = React.useState<string>(product.imageUrl ?? "");
  const [previewTags] = React.useState<string[]>(product.tags ?? []);
  const [previewImages, setPreviewImages] = React.useState<string[]>(product.previewImages ?? []);
  const [shortDescription, setShortDescription] = React.useState<string | undefined>(product.shortDescription ?? undefined);
  const [metaTitle, setMetaTitle] = React.useState<string | undefined>(product.metaTitle ?? undefined);
  const [metaDescription, setMetaDescription] = React.useState<string | undefined>(product.metaDescription ?? undefined);

  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(product.categoryId ?? "");
  const [mainImageFile, setMainImageFile] = React.useState<File | null>(null);
  const [description, setDescription] = React.useState<string>(product.description ?? "");

  const [packageWeightUnit, setPackageWeightUnit] = React.useState<"g" | "kg">("g");
  const [packageWeight, setPackageWeight] = React.useState<number | null>(product.weightGrams ?? null);
  const [packageHeightCm, setPackageHeightCm] = React.useState<string>(product.heightCm?.toString() ?? "");
  const [packageWidthCm, setPackageWidthCm] = React.useState<string>(product.widthCm?.toString() ?? "");
  const [packageLengthCm, setPackageLengthCm] = React.useState<string>(product.lengthCm?.toString() ?? "");

  const [addVariant, setAddVariant] = React.useState<boolean>(false);
  const [defaultPrice, setDefaultPrice] = React.useState<string>(product.price?.toString() ?? "");
  const [defaultQuantity, setDefaultQuantity] = React.useState<string>("");

  const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const [variants, setVariants] = React.useState<VariantItem[]>([
    {
      id: createId(),
      name: "",
      options: [
        { id: createId(), value: "", charCount: 0, image: null },
      ],
    },
  ]);
  const [variantTableData, setVariantTableData] = React.useState<VariantCombinationData[]>([]);
  // Map combinationId -> existing variantId to enable updates from editor
  const variantIdByComboRef = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    const extended = product as any;
    const vrows: Array<{
      id: string;
      productId: string;
      sku?: string | null;
      title?: string | null;
      price?: number | null;
      compareAtPrice?: number | null;
      attributes?: Record<string, string> | null;
      packageWeightGrams?: number | null;
      weightUnit?: "g" | "kg" | null;
      stock?: number | null;
    }> | undefined = extended?.variants;

    if (!vrows || vrows.length === 0) {
      setAddVariant(false);
      const qty = extended?.productStock != null ? String(extended.productStock) : "";
      setDefaultQuantity(qty);
      return;
    }

    setAddVariant(true);

    // Derive variant groups and options from variant attributes
    const groupNamesSet = new Set<string>();
    for (const v of vrows) {
      const attrs = v.attributes || {};
      Object.keys(attrs).forEach((k) => groupNamesSet.add(k));
    }
    const groupNames = Array.from(groupNamesSet);

    const optionIdByGroupValue: Record<string, Record<string, string>> = {};
    const derivedVariants: VariantItem[] = groupNames.map((name) => {
      const valuesSet = new Set<string>();
      for (const v of vrows) {
        const val = v.attributes?.[name];
        if (val && val.trim() !== "") valuesSet.add(val);
      }
      const options: VariantOption[] = Array.from(valuesSet).map((val) => {
        const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        optionIdByGroupValue[name] = optionIdByGroupValue[name] || {};
        optionIdByGroupValue[name][val] = id;
        return { id, value: val, charCount: val.length, image: null };
      });
      // Add trailing empty option row for UX consistency
      options.push({ id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, value: "", charCount: 0, image: null });
      return { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, name, options };
    });

    setVariants(derivedVariants);

    const derivedTable: VariantCombinationData[] = vrows.map((v) => {
      const optionsRec: Record<string, string> = {};
      const comboIds: string[] = [];
      for (const name of groupNames) {
        const val = v.attributes?.[name];
        if (val && val.trim() !== "") {
          optionsRec[name] = val;
          const oid = optionIdByGroupValue[name]?.[val];
          if (oid) comboIds.push(oid);
        } else {
          optionsRec[name] = "-";
        }
      }
      const combinationId = comboIds.join("-");
      // Track mapping to existing variant id
      if (combinationId) {
        variantIdByComboRef.current[combinationId] = v.id;
      }
      const unit = (v.weightUnit as "g" | "kg") ?? "g";
      const grams = v.packageWeightGrams ?? null;
      const weightStr = grams != null ? (unit === "kg" ? (Number(grams) / 1000).toString() : String(grams)) : "";
      return {
        combinationId,
        options: optionsRec,
        price: v.price != null ? String(v.price) : "",
        quantity: v.stock != null ? String(v.stock) : "",
        sku: v.sku ?? "",
        weight: weightStr,
        weightUnit: unit,
      };
    });

    setVariantTableData(derivedTable);
  }, [product.id]);
  const handleToggleAddVariant = (checked: boolean) => {
    setAddVariant(checked);
    if (!checked) {
      setVariantTableData([]);
    } else {
      generateVariantCombinations(variants);
    }
  };

  // Router is already initialized above; avoid duplicate declarations

  // Router
  const router = useRouter();

  const handleDefaultPriceChange = (value: string) => setDefaultPrice(value);
  const handleDefaultQuantityChange = (value: string) => setDefaultQuantity(value);

  const handleSelectedCategoryIdChange = (id: string) => setSelectedCategoryId(id);
  const handleMainImageFileChange = (file: File) => setMainImageFile(file);
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    const trimmed = value.trim();
    const short = trimmed.length > 160 ? trimmed.slice(0, 160) : trimmed;
    setShortDescription(short || undefined);
    const metaDesc = trimmed.length > 160 ? trimmed.slice(0, 160) : trimmed;
    setMetaDescription(metaDesc || undefined);
  };

  const generateVariantCombinations = (variantItems: VariantItem[]) => {
    const namedVariants = variantItems.filter((v) => v.name && v.name.trim() !== "");
    const optionLists = namedVariants.map((v) => v.options.filter((o) => o.value && o.value.trim() !== ""));
    const nonEmptyOptionLists = optionLists.filter((list) => list.length > 0);
    if (namedVariants.length === 0 || nonEmptyOptionLists.length === 0) {
      setVariantTableData([]);
      return;
    }
    const product = (arrays: VariantOption[][]): VariantOption[][] => {
      return arrays.reduce<VariantOption[][]>((acc, curr) => {
        if (acc.length === 0) return curr.map((c) => [c]);
        const result: VariantOption[][] = [];
        for (const a of acc) {
          for (const c of curr) {
            result.push([...a, c]);
          }
        }
        return result;
      }, []);
    };
    const combos = product(nonEmptyOptionLists);
    setVariantTableData((prev) => {
      return combos.map((optCombo) => {
        const comboOptions: Record<string, string> = {};
        const comboIds: string[] = [];
        let nonEmptyIdx = 0;
        namedVariants.forEach((v, idx) => {
          const vOptions = optionLists[idx];
          if (vOptions.length > 0) {
            const opt = optCombo[nonEmptyIdx];
            comboOptions[v.name] = opt.value;
            comboIds.push(opt.id);
            nonEmptyIdx++;
          } else {
            comboOptions[v.name] = "-";
          }
        });
        const combinationId = comboIds.join("-");
        const existing = prev.find((c) => c.combinationId === combinationId);
        return {
          combinationId,
          options: comboOptions,
          price: existing?.price ?? "",
          quantity: existing?.quantity ?? "",
          sku: existing?.sku ?? "",
          weight: existing?.weight ?? "",
          weightUnit: existing?.weightUnit ?? "g",
        };
      });
    });
  };

  const handleAddVariantSection = () => {
    setVariants((prev) => {
      if (prev.length >= 3) return prev;
      const newVariant: VariantItem = {
        id: createId(),
        name: "",
        options: [{ id: createId(), value: "", charCount: 0, image: null }],
      };
      const updated = [...prev, newVariant];
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleRemoveVariantSection = (variantId: string) => {
    setVariants((prev) => {
      const updated = prev.filter((v) => v.id !== variantId);
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleVariantNameChange = (variantId: string, name: string) => {
    setVariants((prev) => {
      const updated = prev.map((v) => (v.id === variantId ? { ...v, name } : v));
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleVariantOptionValueChange = (variantId: string, optionId: string, value: string) => {
    setVariants((prev) => {
      const updated = prev.map((v) => {
        if (v.id !== variantId) return v;
        const newOptions = v.options.map((o) => (o.id === optionId ? { ...o, value, charCount: value.length } : o));
        const last = newOptions[newOptions.length - 1];
        if (last.id === optionId && value.trim() !== "") {
          newOptions.push({ id: createId(), value: "", charCount: 0, image: null });
        }
        return { ...v, options: newOptions };
      });
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleRemoveVariantOption = (variantId: string, optionId: string) => {
    setVariants((prev) => {
      const updated = prev.map((v) => {
        if (v.id !== variantId) return v;
        const filtered = v.options.filter((o) => o.id !== optionId);
        const options = filtered.length === 0 ? [{ id: createId(), value: "", charCount: 0, image: null }] : filtered;
        return { ...v, options };
      });
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleReorderVariantOptions = (variantId: string, newOptions: VariantOption[]) => {
    setVariants((prev) => {
      const updated = prev.map((v) => (v.id === variantId ? { ...v, options: newOptions } : v));
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleVariantOptionImageChange = (variantId: string, optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setVariants((prev) => prev.map((v) => {
      if (v.id !== variantId) return v;
      return {
        ...v,
        options: v.options.map((o) => (o.id === optionId ? { ...o, image: file } : o)),
      };
    }));
  };

  const handleVariantTableInputChange = (combinationId: string, field: keyof VariantCombinationData, value: string) => {
    setVariantTableData((prev) => prev.map((c) => (c.combinationId === combinationId ? { ...c, [field]: value } : c)));
  };

  const handleWeightUnitChange = (combinationId: string, unit: "g" | "kg") => {
    setVariantTableData((prev) => prev.map((c) => (c.combinationId === combinationId ? { ...c, weightUnit: unit } : c)));
  };

  const handleRemoveVariantCombination = (combinationId: string) => {
    setVariantTableData((prev) => prev.filter((c) => c.combinationId !== combinationId));
  };

  const handleCancel = () => {
    history.back();
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...");
  };

  // Helper to build variant update payload from current table
  const buildVariantUpdateItems = () => {
    if (!addVariant) return [] as Array<{ id: string; price?: string; stock?: number }>;
    return (
      variantTableData
        .map((row) => {
          const id = variantIdByComboRef.current[row.combinationId];
          if (!id) return null;
          const out: any = { id };
          const priceTrim = String(row.price ?? "").trim();
          const qtyTrim = String(row.quantity ?? "").trim();
          if (priceTrim !== "" && !Number.isNaN(Number(priceTrim))) out.price = priceTrim;
          if (qtyTrim !== "" && !Number.isNaN(Number(qtyTrim))) out.stock = Number(qtyTrim);
          return out;
        })
        .filter(Boolean) as Array<{ id: string; price?: string; stock?: number }>
    );
  };

  const handleSubmit = async () => {
    if (!previewTitle.trim()) {
      toast.error("Judul produk wajib diisi");
      return;
    }
    if (!previewCategory.trim()) {
      toast.error("Kategori wajib dipilih");
      return;
    }
    if (!description.trim()) {
      toast.error("Deskripsi wajib diisi");
      return;
    }

    // Gunakan previewImage jika sudah berupa URL remote; jika blob/local, fallback ke nilai lama
    const isRemoteUrl = (u?: string | null) => !!u && (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/"));
    let imageUrlAbs = isRemoteUrl(previewImage) ? previewImage : product.imageUrl;
    try {
      // Hanya upload jika ada file baru dan preview belum berupa URL remote
      if (mainImageFile && !isRemoteUrl(previewImage)) {
        const fd = new FormData();
        fd.append("file", mainImageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          let errMsg = "Gagal mengunggah gambar";
          try {
            const errJson = await res.json();
            errMsg = errJson?.error || errMsg;
          } catch {}
          throw new Error(errMsg);
        }
        const upload = await res.json();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        imageUrlAbs = origin ? `${origin}${upload.url}` : upload.url;
      }

      const slug = slugify(previewTitle);
      const weightGrams = packageWeight != null
        ? (packageWeightUnit === "kg" ? Math.round(packageWeight * 1000) : Math.round(packageWeight))
        : undefined;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const categoryIdVal = selectedCategoryId && uuidRegex.test(selectedCategoryId) ? selectedCategoryId : null;

      const payload = {
        id: product.id,
        title: previewTitle,
        description,
        shortDescription,
        price: defaultPrice || product.price?.toString() || "0",
        categoryId: categoryIdVal,
        category: previewCategory,
        tags: [],
        imageUrl: imageUrlAbs,
        thumbnailUrl: undefined,
        previewImages,
        isPhysical: true,
        requiresShipping: true,
        weightGrams,
        lengthCm: packageLengthCm || undefined,
        widthCm: packageWidthCm || undefined,
        heightCm: packageHeightCm || undefined,
        brand: undefined,
        barcode: undefined,
        material: undefined,
        slug,
        metaTitle,
        metaDescription,
        keywords: [],
        isActive: true,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        publishedAt: product.publishedAt ?? undefined,
        // NEW: product-level stock when there are no variants
        productStock: !addVariant ? Number(defaultQuantity || "0") : undefined,
      } as const;

      // First update the product
      const result = await updateProduct(payload as any);
      if (result.data && !result.error) {
        // Then, if there are variant changes, update variants too
        const variantItems = buildVariantUpdateItems();
        if (variantItems.length > 0) {
          const vResult = await updateVariants({ items: variantItems } as any);
          if (vResult.error) {
            toast.error(`Produk tersimpan, varian gagal: ${vResult.error}`);
            // Still navigate, but inform about partial failure
            router.push("/admin/products");
            router.refresh();
            return;
          }
        }
        toast.success("Produk dan varian berhasil diperbarui");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal memperbarui produk");
      }
    } catch (error: any) {
      toast.error(error?.message || "Terjadi kesalahan saat menyimpan");
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AddHeader title="Edit Produk" onCancel={handleCancel} onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <NavCard sections={sections} previewTitle={previewTitle} previewCategory={previewCategory} previewImage={previewImage} previewTags={previewTags} />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <BasicInfoCard
              onPreviewTitleChange={setPreviewTitle}
              onPreviewCategoryChange={setPreviewCategory}
              onPreviewImageChange={(url) => setPreviewImage(url)}
              onSelectedCategoryIdChange={handleSelectedCategoryIdChange}
              onMainImageFileChange={handleMainImageFileChange}
              onPreviewImagesChange={(urls) => setPreviewImages(urls)}
              onMetaTitleChange={(t) => setMetaTitle(t || undefined)}
              initialTitle={product.title}
              initialCategoryId={product.categoryId ?? undefined}
              initialCategoryName={product.category}
              initialImageUrl={product.imageUrl}
              initialPreviewImages={product.previewImages ?? []}
              initialMetaTitle={product.metaTitle ?? undefined}
            />
            <DetailProductCard onDescriptionChange={handleDescriptionChange} initialDescription={product.description} />
            <Card id="sales" className="rounded-lg border bg-background">
              <CardHeader>
                <CardTitle>Info Penjualan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SalesInfoCard
                  addVariant={addVariant}
                  onToggleAddVariant={handleToggleAddVariant}
                  defaultPrice={defaultPrice}
                  onDefaultPriceChange={handleDefaultPriceChange}
                  defaultQuantity={defaultQuantity}
                  onDefaultQuantityChange={handleDefaultQuantityChange}
                />
              <VariantsEditor
                addVariant={addVariant}
                variants={variants}
                variantTableData={variantTableData}
                onAddVariantSection={handleAddVariantSection}
                onRemoveVariantSection={handleRemoveVariantSection}
                onVariantNameChange={handleVariantNameChange}
                onRemoveVariantOption={handleRemoveVariantOption}
                onVariantOptionValueChange={handleVariantOptionValueChange}
                onVariantOptionImageChange={handleVariantOptionImageChange}
                onVariantTableInputChange={handleVariantTableInputChange}
                onWeightUnitChange={handleWeightUnitChange}
                onRemoveVariantCombination={handleRemoveVariantCombination}
                onReorderVariantOptions={handleReorderVariantOptions}
              />
              </CardContent>
            </Card>
            <ShippingCard
              addVariant={addVariant}
              onWeightUnitChange={setPackageWeightUnit}
              onWeightChange={(w) => setPackageWeight(w)}
              onDimensionsChange={({ heightCm, widthCm, lengthCm }) => {
                if (heightCm !== undefined) setPackageHeightCm(heightCm);
                if (widthCm !== undefined) setPackageWidthCm(widthCm);
                if (lengthCm !== undefined) setPackageLengthCm(lengthCm);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
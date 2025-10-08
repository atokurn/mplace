"use client";

import * as React from "react";
import {
  AddHeader,
  NavCard,
  BasicInfoCard,
  DetailProductCard,
  CostPriceCard,
  SalesInfoCard,
  ShippingCard,
  SkuMappingCard,
  VariantsEditor,
} from "@/app/_components/features/admin/products/add";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct } from "@/app/_lib/actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/utils/slug";

// Local types aligned with VariantsEditor
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

export default function AddProductPage() {
  const sections = [
    { id: 'basic', label: 'Informasi dasar' },
    { id: 'detail', label: 'Detail produk' },
    { id: 'cost', label: 'Harga Modal' },
    { id: 'sales', label: 'Info penjualan' },
    { id: 'shipping', label: 'Pengiriman' },
    { id: 'sku-mapping', label: 'SKU Mapping' },
  ];

  const [previewTitle, setPreviewTitle] = React.useState<string>("");
  const [previewCategory, setPreviewCategory] = React.useState<string>("");
  const [previewImage, setPreviewImage] = React.useState<string>("");
  const [previewTags] = React.useState<string[]>([]);
  // New states for gallery and SEO
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [shortDescription, setShortDescription] = React.useState<string | undefined>(undefined);
  const [metaTitle, setMetaTitle] = React.useState<string | undefined>(undefined);
  const [metaDescription, setMetaDescription] = React.useState<string | undefined>(undefined);

  // New state wired to non-visual callbacks
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("");
  const [mainImageFile, setMainImageFile] = React.useState<File | null>(null);
  const [description, setDescription] = React.useState<string>("");

  // Shipping state (product-level)
  const [packageWeightUnit, setPackageWeightUnit] = React.useState<"g" | "kg">("g");
  const [packageWeight, setPackageWeight] = React.useState<number | null>(null);
  const [packageHeightCm, setPackageHeightCm] = React.useState<string>("");
  const [packageWidthCm, setPackageWidthCm] = React.useState<string>("");
  const [packageLengthCm, setPackageLengthCm] = React.useState<string>("");

  // Sales Info state
  const [addVariant, setAddVariant] = React.useState<boolean>(false);
  const [defaultPrice, setDefaultPrice] = React.useState<string>("");
  const [defaultQuantity, setDefaultQuantity] = React.useState<string>("");

  // Variants state
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

  // Handlers for SalesInfoCard
  const handleToggleAddVariant = (checked: boolean) => {
    setAddVariant(checked);
    if (!checked) {
      // Reset variants-related data when turning off variants
      setVariantTableData([]);
    } else {
      // Generate combinations when enabling if options already set
      generateVariantCombinations(variants);
    }
  };

  const handleDefaultPriceChange = (value: string) => setDefaultPrice(value);
  const handleDefaultQuantityChange = (value: string) => setDefaultQuantity(value);

  // Handlers for non-visual callbacks
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

  // Utility: generate cartesian product combinations
  const generateVariantCombinations = (variantItems: VariantItem[]) => {
    const namedVariants = variantItems.filter((v) => v.name && v.name.trim() !== "");
    const optionLists = namedVariants.map((v) => v.options.filter((o) => o.value && o.value.trim() !== ""));

    // Only require at least one variant to have options; for empty variants use "-" as placeholder
    const nonEmptyOptionLists = optionLists.filter((list) => list.length > 0);
    if (namedVariants.length === 0 || nonEmptyOptionLists.length === 0) {
      setVariantTableData([]);
      return;
    }

    // Cartesian product across non-empty option lists
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

        // Build options per named variant; use '-' for variants without options yet
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

  // Handlers for VariantsEditor
  const handleAddVariantSection = () => {
    setVariants(prev => {
      if (prev.length >= 3) return prev;
      const newVariant: VariantItem = {
        id: createId(),
        name: "",
        options: [{ id: createId(), value: "", charCount: 0, image: null }],
      };
      const updated = [...prev, newVariant];
      // Recalculate combinations when adding a new variant (will likely clear until named/options set)
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleRemoveVariantSection = (variantId: string) => {
    setVariants(prev => {
      const updated = prev.filter(v => v.id !== variantId);
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleVariantNameChange = (variantId: string, name: string) => {
    setVariants(prev => {
      const updated = prev.map(v => v.id === variantId ? { ...v, name } : v);
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleVariantOptionValueChange = (variantId: string, optionId: string, value: string) => {
    setVariants(prev => {
      const updated = prev.map(v => {
        if (v.id !== variantId) return v;
        const newOptions = v.options.map(o => o.id === optionId ? { ...o, value, charCount: value.length } : o);
        // If editing the last row and now has content, append a new blank row
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
    setVariants(prev => {
      const updated = prev.map(v => {
        if (v.id !== variantId) return v;
        const filtered = v.options.filter(o => o.id !== optionId);
        // Ensure at least one blank option remains
        const options = filtered.length === 0 ? [{ id: createId(), value: "", charCount: 0, image: null }] : filtered;
        return { ...v, options };
      });
      generateVariantCombinations(updated);
      return updated;
    });
  };

  // Enable reordering of variant options (drag & drop)
  const handleReorderVariantOptions = (variantId: string, newOptions: VariantOption[]) => {
    setVariants(prev => {
      const updated = prev.map(v => (v.id === variantId ? { ...v, options: newOptions } : v));
      generateVariantCombinations(updated);
      return updated;
    });
  };

  const handleVariantOptionImageChange = (variantId: string, optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v;
      return {
        ...v,
        options: v.options.map(o => o.id === optionId ? { ...o, image: file } : o),
      };
    }));
  };

  const handleVariantTableInputChange = (combinationId: string, field: keyof VariantCombinationData, value: string) => {
    setVariantTableData(prev => prev.map(c => c.combinationId === combinationId ? { ...c, [field]: value } : c));
  };

  const handleWeightUnitChange = (combinationId: string, unit: "g" | "kg") => {
    setVariantTableData(prev => prev.map(c => c.combinationId === combinationId ? { ...c, weightUnit: unit } : c));
  };

  const handleRemoveVariantCombination = (combinationId: string) => {
    setVariantTableData(prev => prev.filter(c => c.combinationId !== combinationId));
  };

  const handleCancel = () => {
    history.back();
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft logic
    console.log('Saving draft...');
  };

  const router = useRouter();



  const handleSubmit = async () => {
    // Validations
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
    if (!mainImageFile) {
      toast.error("Gambar utama wajib diunggah");
      return;
    }
    // Harga: tergantung mode varian
    if (!addVariant) {
      if (!defaultPrice.trim()) {
        toast.error("Harga wajib diisi");
        return;
      }
    } else {
      if (variantTableData.length === 0) {
        toast.error("Tambahkan varian dan isi harga untuk setiap kombinasi");
        return;
      }
      const allPricesFilled = variantTableData.every((c) => c.price && c.price.trim() !== "");
      if (!allPricesFilled) {
        toast.error("Harga wajib diisi untuk semua varian");
        return;
      }
    }

    try {
      // Upload main image
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
      const imageUrlAbs = origin ? `${origin}${upload.url}` : upload.url;

      const slug = slugify(previewTitle);
      const weightGrams = packageWeight != null
        ? (packageWeightUnit === "kg" ? Math.round(packageWeight * 1000) : Math.round(packageWeight))
        : undefined;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const categoryIdVal = selectedCategoryId && uuidRegex.test(selectedCategoryId) ? selectedCategoryId : null;

      // Turunkan harga produk dari varian (minimal), bila varian aktif
      const variantPrices = addVariant
        ? variantTableData
            .map((c) => Number(c.price))
            .filter((p) => !Number.isNaN(p) && p >= 0)
        : [];
      const priceForPayload = !addVariant
        ? defaultPrice
        : String(variantPrices.length ? Math.min(...variantPrices) : 0);

      // Build variants payload when addVariant is true
      const variantsPayload = addVariant
        ? variantTableData.map((c) => {
            const qty = c.quantity && c.quantity.trim() !== "" ? parseInt(c.quantity, 10) : 0;
            const w = c.weight && c.weight.trim() !== "" ? Number(c.weight) : NaN;
            const packageWeightGrams = Number.isFinite(w)
              ? c.weightUnit === "kg"
                ? Math.round(w * 1000)
                : Math.round(w)
              : undefined;
            return {
              sku: c.sku,
              price: c.price,
              attributes: c.options, // { VariantName: OptionValue }
              stock: Number.isFinite(qty) && qty >= 0 ? qty : 0,
              packageWeightGrams,
              weightUnit: c.weightUnit,
              isActive: true,
            };
          })
        : undefined;

      const payload = {
        title: previewTitle,
        description,
        shortDescription,
        price: priceForPayload,
        originalPrice: undefined,
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
        slug: slug,
        metaTitle,
        metaDescription,
        keywords: [],
        isActive: true,
        isFeatured: false,
        isNew: true,
        isBestseller: false,
        publishedAt: undefined,
        variants: variantsPayload,
      } as const;

      const result = await createProduct(payload as any);
      if (result.data && !result.error) {
        toast.success("Produk berhasil dibuat");
        router.push("/products");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal membuat produk");
      }
    } catch (error: any) {
      toast.error(error?.message || "Terjadi kesalahan saat menyimpan");
      // eslint-disable-next-line no-console
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AddHeader onCancel={handleCancel} onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
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
            />
            <DetailProductCard onDescriptionChange={handleDescriptionChange} />
            {/* <CostPriceCard /> */}
            {/* Sales Info and Variants */}
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
            <ShippingCard addVariant={addVariant} onWeightUnitChange={setPackageWeightUnit} onWeightChange={(w) => setPackageWeight(w)} onDimensionsChange={({ heightCm, widthCm, lengthCm }) => {
              if (heightCm !== undefined) setPackageHeightCm(heightCm);
              if (widthCm !== undefined) setPackageWidthCm(widthCm);
              if (lengthCm !== undefined) setPackageLengthCm(lengthCm);
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
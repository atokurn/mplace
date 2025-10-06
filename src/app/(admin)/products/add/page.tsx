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

  const handleSubmit = () => {
    // TODO: Implement submit logic
    console.log('Submitting product...');
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
            <BasicInfoCard onPreviewTitleChange={setPreviewTitle} onPreviewCategoryChange={setPreviewCategory} onPreviewImageChange={setPreviewImage} />
            <DetailProductCard />
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
            <ShippingCard addVariant={addVariant} />
          </div>
        </div>
      </div>
    </div>
  );
}
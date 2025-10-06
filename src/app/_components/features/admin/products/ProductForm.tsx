"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/_lib/actions/products";
import { getAllCategories } from "@/app/_lib/queries/categories";
import type { SelectProduct } from "@/lib/db/schema";
import { useState, useEffect } from "react";

// Minimal category type used by this form
export type CategoryOption = { id: string; name: string };

const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  categoryId: z.string().min(1, "Category is required"),
  category: z.string().min(1, "Category name is required"),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().min(1, "Product image is required"),
  isActive: z.boolean().default(true),
  // Shipping & physical product fields (enforced as true)
  isPhysical: z.literal(true),
  requiresShipping: z.literal(true),
  weightGrams: z.coerce.number().optional(),
  lengthCm: z.string().optional(),
  widthCm: z.string().optional(),
  heightCm: z.string().optional(),
  // Sales additions
  useVariants: z.boolean().default(false),
  preOrder: z.boolean().default(false),
  quantity: z.coerce.number().optional(),
  sku: z.string().optional(),
  buyerLimitEnabled: z.boolean().default(false),
  minPurchase: z.coerce.number().optional(),
  maxPurchase: z.coerce.number().optional(),
  // Shipping additions/enhancements
  packageWeightUnit: z.enum(["g", "kg"]).default("g"),
  shippingOption: z.enum(["default", "custom"]).default("default"),
  codEnabled: z.boolean().default(false),
  shippingInsurance: z.enum(["mandatory", "optional"]).default("optional"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: SelectProduct;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema as unknown as z.ZodTypeAny),
    defaultValues: {
       title: product?.title || "",
       description: product?.description || "",
       price: product?.price || "",
      categoryId: product?.categoryId || "",
      category: product?.category || "",
      tags: (product?.tags as string[]) || [],
      imageUrl: product?.imageUrl || "",
      isActive: product?.isActive ?? true,
      // Defaults for new fields
      isPhysical: true,
      requiresShipping: true,
      weightGrams: 0,
      lengthCm: "",
      widthCm: "",
      heightCm: "",
      useVariants: false,
      preOrder: false,
      quantity: 0,
      sku: "",
      buyerLimitEnabled: false,
      minPurchase: 1,
      maxPurchase: 0,
      packageWeightUnit: "g",
      shippingOption: "default",
      codEnabled: false,
      shippingInsurance: "optional",
    },
  });

  // Values for real-time preview & sidebar navigation
  const previewTitle = form.watch('title');
  const previewPrice = form.watch('price');
  const previewImage = form.watch('imageUrl');
  const previewCategory = form.watch('category');
  const previewTags = form.watch('tags');
  const sections = [
    { id: 'basic', label: 'Informasi dasar' },
    { id: 'detail', label: 'Detail produk' },
    { id: 'sales', label: 'Info penjualan' },
    { id: 'shipping', label: 'Pengiriman' },
  ];

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getAllCategories();
        // Map to minimal shape expected by this form (id, name)
        const simplified: CategoryOption[] = categoriesData.map(({ id, name }) => ({ id, name }));
        setCategories(simplified);
      } catch {
        toast.error("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

  // RajaOngkir config status (client-safe)
  const [rkConfigured, setRkConfigured] = useState<boolean | null>(null);
  const [rkMissing, setRkMissing] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/shipping/rates", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch shipping config status");
        const data = (await res.json()) as { configured?: boolean; missing?: string[] };
        if (!active) return;
        setRkConfigured(!!data?.configured);
        setRkMissing(Array.isArray(data?.missing) ? data.missing : []);
      } catch {
        if (!active) return;
        // If endpoint not available, fail-open (don't block users)
        setRkConfigured(true);
        setRkMissing([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview (optional)
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // TODO: Implement actual file upload to Cloudflare R2
    // For now, we'll use a placeholder URL
    const imageUrl = URL.createObjectURL(file);
    form.setValue('imageUrl', imageUrl);
    toast.success('Image uploaded successfully');
  };

  const addTag = () => {
    if (tagInput.trim() && !form.getValues('tags').includes(tagInput.trim())) {
      const currentTags = form.getValues('tags');
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      // Map only fields that backend currently supports
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        category: data.category,
        tags: data.tags,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
      } as const;

      if (product) {
        await updateProduct({ id: product.id, ...payload });
        toast.success('Product updated successfully');
      } else {
        const slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const newProductInput = {
          ...payload,
          slug,
        } as const;

        await createProduct(newProductInput as Parameters<typeof createProduct>[0]);
        toast.success('Product created successfully');
      }
      router.push('/products');
    } catch {
      toast.error(product ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-12xl mx-auto">
          {/* Header */}
          {!product && (
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-foreground">Tambahkan produk baru</h1>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/products')}
                  className="px-6"
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading} className="px-6 bg-green-600 hover:bg-green-700">
                  {isLoading ? 'Menyimpan...' : 'Kirim untuk ditinjau'}
                </Button>
              </div>
            </div>
          )}

          {/* Content: left nav + preview + right form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Navigation + Preview */}
            <aside className="lg:col-span-4 space-y-4 sticky top-20 self-start">
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
                  <div className="text-green-600 font-semibold">
                    {previewPrice ? `Rp ${previewPrice}` : 'Rp -'}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {Array.isArray(previewTags) && previewTags.map((tag: string, i: number) => (
                      <Badge key={`${tag}-${i}`} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right: Form sections */}
            <main className="lg:col-span-8 space-y-6">
              {/* Informasi dasar */}
              <section id="basic" className="rounded-lg border p-6 bg-background space-y-6">
                <h2 className="text/base font-semibold">Informasi dasar</h2>
                {/* Product Images */}
                <div>
                  <FormLabel className="text-sm font-medium mb-3 block">Gambar</FormLabel>
                  <div className="grid grid-cols-4 gap-3">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="relative aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-muted-foreground/50 transition-colors">
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <span className="text-xs">Unggah</span>
                        <span className="text-xs">gambar</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nama produk</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Bird Realistic PNG" className="bg-background border-border" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Kategori</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedCategory = categories.find((cat: CategoryOption) => cat.id === value);
                          if (selectedCategory) {
                            form.setValue('category', selectedCategory.name);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: CategoryOption) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Detail produk */}
              <section id="detail" className="rounded-lg border p-6 bg-background space-y-6">
                <h2 className="text-base font-semibold">Detail produk</h2>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Masukkan deskripsi produk" className="min-h-[120px] bg-background border-border resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <div>
                  <FormLabel className="text-sm font-medium mb-3 block">Tag</FormLabel>
                  <div className="flex gap-2 mb-3">
                    <Input placeholder="Tambah tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="bg-background border-border" />
                    <Button type="button" onClick={addTag} size="sm" className="bg-green-600 hover:bg-green-700 text-white px-4">+</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch('tags').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-muted text-muted-foreground">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Active toggle */}
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel className="text-sm font-medium">Aktif</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </section>

              {/* Info penjualan */}
              <section id="sales" className="rounded-lg border p-6 bg-background space-y-6">
                <h2 className="text-base font-semibold">Info penjualan</h2>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="useVariants"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <FormLabel className="text-sm font-medium">Tambah varian</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preOrder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <FormLabel className="text-sm font-medium">Pre-order</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Harga & Stok row */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Harga & Stok</div>
                    <Button type="button" variant="outline" size="sm">Ubah sekaligus</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Harga jual</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Rp" className="bg-background border-border" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Additional sales fields could go here */}
                  </div>
                </div>
              </section>

              {/* Pengiriman */}
              <section id="shipping" className="rounded-lg border p-6 bg-background space-y-6">
                <h2 className="text-base font-semibold">Pengiriman</h2>

                {rkConfigured === false && (
                  <div className="text-sm rounded-md border p-3 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    Tip: Set {rkMissing.join(", ")} di .env.local agar perhitungan ongkir aktif.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* isPhysical & requiresShipping enforced as true system-wide; toggles removed */}
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weightGrams"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Berat (gram)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" className="bg-background border-border" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lengthCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Panjang (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="0" className="bg-background border-border" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="widthCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Lebar (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="0" className="bg-background border-border" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tinggi (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="0" className="bg-background border-border" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="packageWeightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Satuan berat</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder="Pilih satuan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="g">Gram (g)</SelectItem>
                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Opsi pengiriman</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder="Pilih opsi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="custom">Kustom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <FormLabel className="text-sm font-medium">COD</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingInsurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Asuransi pengiriman</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-border">
                              <SelectValue placeholder="Pilih opsi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mandatory">Wajib</SelectItem>
                            <SelectItem value="optional">Opsional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </main>
          </div>
        </form>
      </Form>
    </div>
  );
}
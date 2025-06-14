"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { X, Upload, Image as ImageIcon, File } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/_lib/actions/products";
import { getAllCategories } from "@/app/_lib/queries/categories";
import type { SelectProduct, SelectCategory } from "@/lib/db/schema";
import { useState, useEffect } from "react";

const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  hasCommercialPrice: z.boolean().default(false),
  commercialPrice: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  category: z.string().min(1, "Category name is required"),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().min(1, "Product image is required"),
  fileUrl: z.string().min(1, "Product file is required"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().min(1, "File size is required"),
  isActive: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: SelectProduct;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<SelectCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(
    product ? { name: product.fileName, size: product.fileSize } : null
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || "",
      hasCommercialPrice: false,
      commercialPrice: "",
      categoryId: product?.categoryId || "",
      category: product?.category || "",
      tags: (product?.tags as string[]) || [],
      imageUrl: product?.imageUrl || "",
      fileUrl: product?.fileUrl || "",
      fileName: product?.fileName || "",
      fileSize: product?.fileSize || 0,
      isActive: product?.isActive ?? true,
    },
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // TODO: Implement actual file upload to Cloudflare R2
    // For now, we'll use a placeholder URL
    const imageUrl = URL.createObjectURL(file);
    form.setValue('imageUrl', imageUrl);
    toast.success('Image uploaded successfully');
  };

  const handleFileUpload = async (file: File) => {
    // Set file info
    setFileInfo({ name: file.name, size: file.size });
    
    // TODO: Implement actual file upload to Cloudflare R2
    // For now, we'll use a placeholder URL
    const fileUrl = URL.createObjectURL(file);
    form.setValue('fileUrl', fileUrl);
    form.setValue('fileName', file.name);
    form.setValue('fileSize', file.size);
    toast.success('File uploaded successfully');
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
      if (product) {
        await updateProduct({ id: product.id, ...data });
        toast.success('Product updated successfully');
      } else {
        await createProduct(data);
        toast.success('Product created successfully');
      }
      router.push('/products');
    } catch (error) {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/products')}
                className="px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="px-6 bg-green-600 hover:bg-green-700">
                {isLoading ? 'Saving...' : 'Create Product'}
              </Button>
            </div>
          </div>

          {/* Main Content - 2 Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Card */}
            <Card className="p-6">
              <CardContent className="space-y-6 p-0">
              {/* Product Images */}
              <div>
                <FormLabel className="text-sm font-medium mb-3 block">Product Images</FormLabel>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="relative aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-muted-foreground/50 transition-colors">
                      <ImageIcon className="h-6 w-6 mb-1" />
                      <span className="text-xs">Drag</span>
                      <span className="text-xs">Drop</span>
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

              {/* Product Name */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Product Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Bird Realistic PNG" 
                        className="bg-background border-border"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter Product Description" 
                        className="min-h-[120px] bg-background border-border resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Upload */}
              <div>
                <FormLabel className="text-sm font-medium mb-3 block">File Upload</FormLabel>
                {fileInfo ? (
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background">
                    <File className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{fileInfo.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFileInfo(null);
                        form.setValue('fileUrl', '');
                        form.setValue('fileName', '');
                        form.setValue('fileSize', 0);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm mb-1">Drag & Drop</span>
                      <span className="text-xs">or click to browse</span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </div>
                )}
              </div>
              </CardContent>
            </Card>

            {/* Right Card */}
            <Card className="p-6">
              <CardContent className="space-y-6 p-0">
              {/* Active Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <FormLabel className="text-sm font-medium">Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Price" 
                        className="bg-background border-border"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add Commercial Price */}
              <FormField
                control={form.control}
                name="hasCommercialPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border border-border"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Add Commercial Price
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Additional Price (shown when checkbox is checked) */}
              {form.watch('hasCommercialPrice') && (
                <FormField
                  control={form.control}
                  name="commercialPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Additional Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="Additional Price" 
                          className="bg-background border-border"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Category</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedCategory = categories.find(cat => cat.id === value);
                        if (selectedCategory) {
                          form.setValue('category', selectedCategory.name);
                        }
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div>
                <FormLabel className="text-sm font-medium mb-3 block">Tags</FormLabel>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="bg-background border-border"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-4"
                  >
                    +
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {form.watch('tags').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-muted text-muted-foreground">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
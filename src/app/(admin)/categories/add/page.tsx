"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Shell } from "@/app/_components/shared/layouts/shell";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { createCategorySchema, type CreateCategorySchema } from "@/app/_lib/validations/categories";
import { z } from 'zod'; // Import z
import { createCategory } from "@/app/_lib/actions/categories";
import { getAllCategories } from "@/app/_lib/queries/categories";
import { FileUpload } from "@/components/ui/file-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [parentCategories, setParentCategories] = React.useState<Array<{id: string, name: string}>>([]);

  const form = useForm<any>({ // Changed type to any for debugging with simplified schema
    resolver: zodResolver(z.object({ name: z.string().min(1, "Name is required"), slug: z.string().optional(), description: z.string().optional(), imageUrl: z.string().optional(), parentId: z.string().nullable().optional(), isActive: z.boolean().optional(), sortOrder: z.number().optional() }) ), // Simplified schema for debugging
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: null,
      isActive: true,
      sortOrder: 0,
    },
  });

  // Load parent categories
  React.useEffect(() => {
    const loadParentCategories = async () => {
      try {
        const categories = await getAllCategories();
        setParentCategories(categories);
      } catch (error) {
        console.error('Failed to load parent categories:', error);
      }
    };
    loadParentCategories();
  }, []);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
      .trim();
  };

  // Watch name field to auto-generate slug
  const watchedName = form.watch("name");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);
  
  React.useEffect(() => {
    if (watchedName && !isSlugManuallyEdited) {
      const generatedSlug = generateSlug(watchedName);
      if (generatedSlug) {
        form.setValue("slug", generatedSlug);
      }
    }
  }, [watchedName, form, isSlugManuallyEdited]);

  async function onSubmit(data: any) { // Changed type to any for debugging with simplified schema
    setIsLoading(true);
    try {
      const result = await createCategory(data);
      
      if (result.data && !result.error) {
        toast.success("Category created successfully");
        router.push("/categories");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create category");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating category:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Category</h1>
            <p className="text-muted-foreground">
              Create a new category to organize your products
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the category (1-100 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input 
                           placeholder="category-slug" 
                           {...field}
                           onChange={(e) => {
                             const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                             field.onChange(value);
                             setIsSlugManuallyEdited(true);
                           }}
                           onFocus={() => setIsSlugManuallyEdited(true)}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the name. Auto-generated from name if left empty.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter category description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description for the category (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "none"}
                          onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select parent category (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No parent category</SelectItem>
                            {parentCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Optional parent category for hierarchical organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                          accept="image/*"
                          maxSize={2}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an image for the category (max 2MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Order in which the category appears (0 = first)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Whether this category is active and visible to users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />


              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
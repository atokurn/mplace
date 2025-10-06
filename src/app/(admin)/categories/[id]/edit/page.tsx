"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ZodTypeAny } from "zod";

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
import { Skeleton } from "@/components/ui/skeleton";
import { updateCategorySchema, type UpdateCategorySchema } from "@/app/_lib/validations/categories";
import { updateCategory } from "@/app/_lib/actions/categories";
import { getCategoryById } from "@/app/_lib/queries/categories";

// Removed EditCategoryPageProps in favor of using useParams in a Client Component

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const form = useForm<UpdateCategorySchema>({
    resolver: zodResolver(updateCategorySchema as unknown as ZodTypeAny),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  // Load category data
  React.useEffect(() => {
    async function loadCategory() {
      if (!id) {
        toast.error("Invalid category id");
        router.push("/admin/categories");
        return;
      }
      try {
        const result = await getCategoryById(id);
        if (result) {
          // category state removed
          form.reset({
            name: result.name || "",
            description: result.description || "",
            imageUrl: result.imageUrl || "",
            isActive: result.isActive ?? true,
            sortOrder: result.sortOrder ?? 0,
          });
        } else {
          toast.error("Category not found");
          router.push("/admin/categories");
        }
      } catch (error) {
        toast.error("Failed to load category");
        console.error("Error loading category:", error);
        router.push("/admin/categories");
      } finally {
        setIsLoadingData(false);
      }
    }

    loadCategory();
  }, [id, form, router]);

  async function onSubmit(data: UpdateCategorySchema) {
    if (!id) {
      toast.error("Invalid category id");
      return;
    }
    setIsLoading(true);
    try {
      const result = await updateCategory({ id, ...data });
      
      if (!result.error) {
        toast.success("Category updated successfully");
        router.push("/admin/categories");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update category");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <Shell variant="sidebar">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96 mt-2" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell variant="sidebar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
            <p className="text-muted-foreground">
              Update the category details
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
              {isLoading ? "Updating..." : "Update Category"}
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
                <FormField<FieldValues, "name">
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

                <FormField<FieldValues, "description">
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

                <FormField<FieldValues, "imageUrl">
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional image URL for the category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<FieldValues, "sortOrder">
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

                <FormField<FieldValues, "isActive">
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
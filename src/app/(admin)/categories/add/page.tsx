"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";
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

import { createCategorySchema, type CreateCategorySchema } from "@/app/_lib/validations/categories";
import { createCategory } from "@/app/_lib/actions/categories";

export default function AddCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema as unknown as ZodTypeAny),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      // parentId is optional in schema; omit by default
      isActive: true,
      sortOrder: 0,
    },
  });

  async function onSubmit(data: CreateCategorySchema) {
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
      // eslint-disable-next-line no-console
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
            <p className="text-muted-foreground">Create a new product category</p>
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
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
                      <FormDescription>The name of the category (1-100 characters)</FormDescription>
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
                        <Input placeholder="e.g. breakfast-foods" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional URL-friendly identifier. If left blank, it will be generated from the name.
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
                        <Textarea placeholder="Enter category description" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormDescription>Optional description (max 500 characters)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        {/* Use text input to allow absolute URLs or project-relative paths per schema */}
                        <Input type="text" placeholder="https://example.com/image.jpg or /uploads/sample.svg" {...field} />
                      </FormControl>
                      <FormDescription>Optional image URL or project-relative path</FormDescription>
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
                      <FormDescription>Determines the order in which categories are displayed</FormDescription>
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
                        <FormLabel className="text-base">Status</FormLabel>
                        <FormDescription>Whether the category is active and visible</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
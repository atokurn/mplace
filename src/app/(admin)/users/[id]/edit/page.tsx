"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUserSchema, type UpdateUserSchema } from "@/app/_lib/validations/users";
import type { ZodTypeAny } from "zod";
import { updateUser } from "@/app/_lib/actions/users";
// Removed server-only import to fix build error
// import { getUserById } from "@/app/_lib/queries/users";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  // removed unused local 'user' state
 
   const form = useForm<UpdateUserSchema>({
     resolver: zodResolver(updateUserSchema as unknown as ZodTypeAny),
     defaultValues: {
       name: "",
       email: "",
       password: "",
       role: "user",
       avatar: "",
     },
   });
 
   // Load user data via API (client-safe)
   React.useEffect(() => {
     async function loadUser() {
       if (!id) {
         toast.error("Invalid user id");
         router.push("/admin/users");
         return;
       }
       try {
         const res = await fetch(`/api/users/${id}`, { cache: "no-store" });
         if (!res.ok) {
           const err = await res.json().catch(() => ({}));
           throw new Error(err?.error || `Failed to fetch user (${res.status})`);
         }
         const result = await res.json();
         const data = result?.data ?? result; // support either {data} or raw
         if (data) {
           form.reset({
             name: data.name || "",
             email: data.email || "",
             role: data.role || "user",
             avatar: data.avatar || "",
             // Don't pre-fill password for security
             password: "",
           });
         } else {
           throw new Error("User not found");
         }
       } catch (error) {
         toast.error("Failed to load user");
         console.error("Error loading user:", error);
         router.push("/admin/users");
       } finally {
         setIsLoadingData(false);
       }
     }
 
     loadUser();
   }, [id, form, router]);
 
  async function onSubmit(data: UpdateUserSchema) {
    setIsLoading(true);
    try {
      if (!id) {
        toast.error("Invalid user id");
        return;
      }
      // Remove empty password field if not provided
      const updateData: UpdateUserSchema & { id: string } = { ...data, id };
      if (!data.password || data.password.trim() === "") {
        // omit password if blank
        delete (updateData as Partial<UpdateUserSchema>).password;
      }

      // Call server action with correct signature
      const result = await updateUser(updateData);
 
       if (!result.error) {
         toast.success("User updated successfully");
         router.push("/admin/users");
         router.refresh();
       } else {
         toast.error(result.error || "Failed to update user");
       }
     } catch (error) {
       toast.error("An unexpected error occurred");
       console.error("Error updating user:", error);
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
                <Skeleton className="h-10 w-full" />
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
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">
              Update the user details and permissions
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
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
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
                        <Input placeholder="Enter user name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The full name of the user
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter user email" {...field} />
                      </FormControl>
                      <FormDescription>
                        The user&apos;s email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password (optional)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Leave blank to keep the current password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Assign the user&apos;s role
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional avatar image URL for the user
                      </FormDescription>
                      <FormMessage />
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
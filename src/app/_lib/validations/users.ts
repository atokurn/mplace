import { usersSearchParamsCache } from "@/lib/search-params"
import { z } from "zod"

export const searchParamsSchemaUsers = usersSearchParamsCache

export type GetUsersSchema = z.infer<typeof searchParamsSchemaUsers>

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]).default("user"),
})

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["user", "admin"]).optional(),
  avatar: z.string().optional(),
})

export const userIdSchema = z.object({
  id: z.string(),
})

export const deleteUsersSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one user must be selected"),
})

export const updateUsersSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one user must be selected"),
  role: z.enum(["user", "admin"]).optional(),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>
export type UserIdSchema = z.infer<typeof userIdSchema>
export type DeleteUsersSchema = z.infer<typeof deleteUsersSchema>
export type UpdateUsersSchema = z.infer<typeof updateUsersSchema>
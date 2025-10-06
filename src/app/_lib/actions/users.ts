"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { takeFirstOrThrow } from "@/lib/db/utils"
import { getErrorMessage } from "@/lib/handle-error"
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { deleteMultiple, deleteSingle } from "@/lib/actions";

type UserRole = "user" | "admin"

type UserUpdateFields = Partial<{
  name: string
  email: string
  password: string
  role: UserRole
  avatar: string | null
  updatedAt: Date
}>

const updateUsersSchema = z.object({
  ids: z.array(z.string()).min(1),
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.boolean().optional(),
})

const deleteUsersSchema = z.object({
  ids: z.array(z.string()).min(1),
})

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]).default("user"),
})

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["user", "admin"]).optional(),
  avatar: z.string().optional(),
})

export async function updateUsers(rawInput: z.infer<typeof updateUsersSchema>) {
  try {
    const validatedInput = updateUsersSchema.parse(rawInput)

    const updateData: Partial<{ role: UserRole; isActive: boolean; updatedAt: Date }> = {
      updatedAt: new Date(),
    }

    if (validatedInput.role !== undefined) {
      updateData.role = validatedInput.role
    }

    await db
      .update(users)
      .set(updateData)
      .where(inArray(users.id, validatedInput.ids))

    revalidatePath("/users")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteUsers(rawInput: z.infer<typeof deleteUsersSchema>) {
  const validatedInput = deleteUsersSchema.parse(rawInput);

  return deleteMultiple({
    table: users,
    ids: validatedInput.ids,
    revalidateTagName: "users",
  });
}

export async function createUser(rawInput: z.infer<typeof createUserSchema>) {
  try {
    const validatedInput = createUserSchema.parse(rawInput)

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedInput.password, 12)

    const user = await db
      .insert(users)
      .values({
        name: validatedInput.name,
        email: validatedInput.email,
        password: hashedPassword,
        role: validatedInput.role,
      })
      .returning()
      .then(takeFirstOrThrow)

    revalidatePath("/users")

    return {
      data: user,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateUser(rawInput: z.infer<typeof updateUserSchema>) {
  try {
    const validatedInput = updateUserSchema.parse(rawInput)

    const updateData: UserUpdateFields = {
      updatedAt: new Date(),
    }

    if (validatedInput.name !== undefined) {
      updateData.name = validatedInput.name
    }

    if (validatedInput.email !== undefined) {
      updateData.email = validatedInput.email
    }

    if (validatedInput.password !== undefined) {
      updateData.password = await bcrypt.hash(validatedInput.password, 12)
    }

    if (validatedInput.role !== undefined) {
      updateData.role = validatedInput.role
    }

    if (validatedInput.avatar !== undefined) {
      updateData.avatar = validatedInput.avatar
    }

    const user = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, validatedInput.id))
      .returning()
      .then(takeFirstOrThrow)

    revalidatePath("/users")
    revalidatePath(`/users/${validatedInput.id}`)

    return {
      data: user,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteUser(id: string) {
  return deleteSingle({
    table: users,
    id,
    revalidateTagName: "users",
  });
}
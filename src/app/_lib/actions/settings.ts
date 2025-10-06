"use server"

import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { getErrorMessage } from "@/lib/handle-error"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { and, eq, inArray } from "drizzle-orm"

const createSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  category: z.enum(["general", "payment", "email", "storage"]).default("general"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

const updateSettingSchema = z.object({
  value: z.string().optional(),
  category: z.enum(["general", "payment", "email", "storage"]).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

const deleteSettingsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one setting must be selected"),
})

const updateSettingsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one setting must be selected"),
  category: z.enum(["general", "payment", "email", "storage"]).optional(),
  isPublic: z.boolean().optional(),
})

export async function createSetting(input: z.infer<typeof createSettingSchema>) {
  try {
    const data = createSettingSchema.parse(input)

    // Check if setting with this key already exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, data.key))
      .limit(1)

    if (existingSetting.length > 0) {
      return {
        data: null,
        error: "Setting with this key already exists",
      }
    }

    const [setting] = await db
      .insert(settings)
      .values({
        key: data.key,
        value: data.value,
        category: data.category,
        description: data.description,
        isPublic: data.isPublic,
      })
      .returning()

    revalidatePath("/settings")

    return {
      data: setting,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

export async function updateSetting(input: { id: string } & z.infer<typeof updateSettingSchema>) {
  try {
    const { id, ...updateData } = input
    const data = updateSettingSchema.parse(updateData)

    const [setting] = await db
      .update(settings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(settings.id, id))
      .returning()

    revalidatePath("/settings")

    return {
      data: setting,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

export async function updateSettingByKey(key: string, value: string) {
  try {
    const [setting] = await db
      .update(settings)
      .set({
        value,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, key))
      .returning()

    if (!setting) {
      // Create new setting if it doesn't exist
      const [newSetting] = await db
        .insert(settings)
        .values({
          key,
          value,
          category: "general",
          isPublic: false,
        })
        .returning()

      revalidatePath("/settings")
      return {
        data: newSetting,
        error: null,
      }
    }

    revalidatePath("/settings")

    return {
      data: setting,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

export async function deleteSetting(input: { id: string }) {
  try {
    const { id } = input

    await db.delete(settings).where(eq(settings.id, id))

    revalidatePath("/settings")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

export async function deleteSettings(input: z.infer<typeof deleteSettingsSchema>) {
  try {
    const { ids } = deleteSettingsSchema.parse(input)

    await db.delete(settings).where(inArray(settings.id, ids))

    revalidatePath("/settings")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

export async function updateSettings(input: z.infer<typeof updateSettingsSchema>) {
  try {
    const { ids, ...updateData } = updateSettingsSchema.parse(input)

    await db
      .update(settings)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(inArray(settings.id, ids))

    revalidatePath("/settings")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

// Bulk update settings by category
export async function updateSettingsByCategory(
  category: "general" | "payment" | "email" | "storage",
  updates: Record<string, string>
) {
  try {
    if (!updates || typeof updates !== 'object') {
      throw new Error('Invalid updates object');
    }
    
    const promises = Object.entries(updates).map(([key, value]) =>
      db
        .update(settings)
        .set({
          value,
          updatedAt: new Date(),
        })
        .where(and(
          eq(settings.key, key),
          eq(settings.category, category)
        ))
    )

    await Promise.all(promises)

    revalidatePath("/settings")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return { data: null, error: getErrorMessage(err) }
  }
}

export type CreateSettingInput = z.infer<typeof createSettingSchema>
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>
export type DeleteSettingsInput = z.infer<typeof deleteSettingsSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
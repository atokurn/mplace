import { settingsSearchParamsCache } from "@/lib/search-params"
import { z } from "zod"

export const searchParamsSchemaSettings = settingsSearchParamsCache

export type GetSettingsSchema = Awaited<ReturnType<typeof settingsSearchParamsCache.parse>>

export const createSettingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
  category: z.enum(["general", "payment", "email", "storage"]).default("general"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export const updateSettingSchema = z.object({
  value: z.string().optional(),
  category: z.enum(["general", "payment", "email", "storage"]).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export const settingIdSchema = z.object({
  id: z.string(),
})

export const settingKeySchema = z.object({
  key: z.string(),
})

export const deleteSettingsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one setting must be selected"),
})

export const updateSettingsSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one setting must be selected"),
  category: z.enum(["general", "payment", "email", "storage"]).optional(),
  isPublic: z.boolean().optional(),
})

export const updateSettingByKeySchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
})

export const updateSettingsByCategorySchema = z.object({
  category: z.enum(["general", "payment", "email", "storage"]),
  updates: z.record(z.string()),
})

export const settingsCategorySchema = z.object({
  category: z.enum(["general", "payment", "email", "storage"]),
})

export const settingsKeysSchema = z.object({
  keys: z.array(z.string()).min(1, "At least one key is required"),
})

export type CreateSettingSchema = z.infer<typeof createSettingSchema>
export type UpdateSettingSchema = z.infer<typeof updateSettingSchema>
export type SettingIdSchema = z.infer<typeof settingIdSchema>
export type SettingKeySchema = z.infer<typeof settingKeySchema>
export type DeleteSettingsSchema = z.infer<typeof deleteSettingsSchema>
export type UpdateSettingsSchema = z.infer<typeof updateSettingsSchema>
export type UpdateSettingByKeySchema = z.infer<typeof updateSettingByKeySchema>
export type UpdateSettingsByCategorySchema = z.infer<typeof updateSettingsByCategorySchema>
export type SettingsCategorySchema = z.infer<typeof settingsCategorySchema>
export type SettingsKeysSchema = z.infer<typeof settingsKeysSchema>
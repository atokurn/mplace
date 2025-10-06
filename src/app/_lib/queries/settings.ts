"use server"

import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { and, count, desc, asc, eq, ilike, inArray, or } from "drizzle-orm"
import type { AnyColumn } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import type { GetSettingsSchema } from "@/app/_lib/validations/settings"

export async function getSettings(input: GetSettingsSchema) {
  return await unstable_cache(
    async () => {
      const { page, per_page, sort, key, category, isPublic, operator } = input
      const offset = (page - 1) * per_page
      const [sortField, sortOrder] = sort?.split(".") ?? ["createdAt", "desc"]

      // Build where conditions
      const conditions = []

      if (key) {
        conditions.push(ilike(settings.key, `%${key}%`))
      }

      if (category && category.length > 0) {
        conditions.push(inArray(settings.category, category))
      }

      if (isPublic !== undefined) {
        conditions.push(eq(settings.isPublic, isPublic))
      }

      const whereClause = conditions.length > 0 
        ? operator === "and" 
          ? and(...conditions)
          : or(...conditions)
        : undefined

      // Map of sortable columns to avoid dynamic indexing on the Table object
      const sortableColumns: Record<string, AnyColumn> = {
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
        key: settings.key,
        category: settings.category,
        isPublic: settings.isPublic,
      }

      const sortCol = sortableColumns[sortField] ?? settings.createdAt

      const orderByClause = sortOrder === "desc" 
        ? desc(sortCol)
        : asc(sortCol)

      const [data, totalResult] = await Promise.all([
        db
          .select({
            id: settings.id,
            key: settings.key,
            value: settings.value,
            category: settings.category,
            description: settings.description,
            isPublic: settings.isPublic,
            createdAt: settings.createdAt,
            updatedAt: settings.updatedAt,
          })
          .from(settings)
          .where(whereClause)
          .orderBy(orderByClause)
          .limit(per_page)
          .offset(offset),
        db
          .select({ count: count() })
          .from(settings)
          .where(whereClause)
      ])

      const total = Number(totalResult[0]?.count ?? 0)
      const pageCount = Math.ceil(total / per_page)

      return {
        data,
        pageCount,
      }
    },
    ["settings", JSON.stringify(input)],
    {
      revalidate: 300,
      tags: ["settings"],
    }
  )()
}

export async function getSettingById(id: string) {
  return await unstable_cache(
    async () => {
      const [setting] = await db
        .select({
          id: settings.id,
          key: settings.key,
          value: settings.value,
          category: settings.category,
          description: settings.description,
          isPublic: settings.isPublic,
          createdAt: settings.createdAt,
          updatedAt: settings.updatedAt,
        })
        .from(settings)
        .where(eq(settings.id, id))

      return setting
    },
    [`setting-${id}`],
    {
      revalidate: 300,
      tags: [`setting-${id}`, "settings"],
    }
  )()
}

export async function getSettingByKey(key: string) {
  return await unstable_cache(
    async () => {
      const [setting] = await db
        .select({
          id: settings.id,
          key: settings.key,
          value: settings.value,
          category: settings.category,
          description: settings.description,
          isPublic: settings.isPublic,
          createdAt: settings.createdAt,
          updatedAt: settings.updatedAt,
        })
        .from(settings)
        .where(eq(settings.key, key))

      return setting
    },
    [`setting-key-${key}`],
    {
      revalidate: 300,
      tags: [`setting-key-${key}`, "settings"],
    }
  )()
}

export async function getSettingsByCategory(category: "general" | "payment" | "email" | "storage") {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          id: settings.id,
          key: settings.key,
          value: settings.value,
          category: settings.category,
          description: settings.description,
          isPublic: settings.isPublic,
          createdAt: settings.createdAt,
          updatedAt: settings.updatedAt,
        })
        .from(settings)
        .where(eq(settings.category, category))
        .orderBy(asc(settings.key))
    },
    [`settings-category-${category}`],
    {
      revalidate: 300,
      tags: [`settings-category-${category}`, "settings"],
    }
  )()
}

export async function getPublicSettings() {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          key: settings.key,
          value: settings.value,
          category: settings.category,
        })
        .from(settings)
        .where(eq(settings.isPublic, true))
        .orderBy(asc(settings.category), asc(settings.key))
    },
    ["public-settings"],
    {
      revalidate: 600, // 10 minutes for public settings
      tags: ["settings", "public-settings"],
    }
  )()
}

export async function getSettingsForExport() {
  return await unstable_cache(
    async () => {
      return await db
        .select({
          id: settings.id,
          key: settings.key,
          value: settings.value,
          category: settings.category,
          description: settings.description,
          isPublic: settings.isPublic,
          createdAt: settings.createdAt,
          updatedAt: settings.updatedAt,
        })
        .from(settings)
        .orderBy(asc(settings.category), asc(settings.key))
    },
    ["settings-export"],
    {
      revalidate: 300,
      tags: ["settings"],
    }
  )()
}

// Helper function to get setting value with fallback
export async function getSettingValue(key: string, fallback: string = "") {
  const setting = await getSettingByKey(key)
  return setting?.value ?? fallback
}

// Helper function to get multiple settings as key-value object
export async function getSettingsObject(keys: string[]) {
  return await unstable_cache(
    async () => {
      const settingsData = await db
        .select({
          key: settings.key,
          value: settings.value,
        })
        .from(settings)
        .where(inArray(settings.key, keys))

      return settingsData.reduce((acc, setting) => {
        acc[String(setting.key)] = String(setting.value ?? "")
        return acc
      }, {} as Record<string, string>)
    },
    [`settings-object-${keys.join(",")}`],
    {
      revalidate: 300,
      tags: ["settings"],
    }
  )()
}
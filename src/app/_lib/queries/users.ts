import "server-only"

import { unstable_cache } from "next/cache"
import { asc, count, desc, eq } from "drizzle-orm"

import { db } from "../../../lib/db"
import { type User, users } from "../../../lib/db/schema"
import { buildFilterWhere } from '../../../lib/filter-columns'
import type { usersSearchParamsCache } from "../../../lib/search-params"

export async function getUsers(input: Awaited<ReturnType<typeof usersSearchParamsCache.parse>>) {
  return await unstable_cache(
    async () => {
      try {
        const { page, perPage, sort, name, email, role, operator } = input

    // Offset to paginate the results
    const offset = (page - 1) * perPage

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof User | undefined, "asc" | "desc" | undefined]

    // Convert the column name to the actual column in the database
    // And sort by the column in the specified order
    const orderBy =
      column && column in users
        ? order === "asc"
          ? asc(users[column])
          : desc(users[column])
        : desc(users.createdAt)

    const filters: {
      column: typeof users.name | typeof users.email | typeof users.role
      value: string | string[]
      operator?: 'eq' | 'ne' | 'ilike' | 'notIlike' | 'isNull' | 'isNotNull' | 'gte' | 'lte' | 'gt' | 'lt' | 'in'
    }[] = []

    if (name) {
      filters.push({
        column: users.name,
        value: name,
        operator: 'ilike',
      })
    }

    if (email) {
      filters.push({
        column: users.email,
        value: email,
        operator: 'ilike',
      })
    }

    if (Array.isArray(role) && role.length > 0) {
      filters.push({
        column: users.role,
        value: role,
        operator: 'in',
      })
    }

    const where = buildFilterWhere(filters, operator)

    // Get data without transaction for now
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .limit(perPage)
      .offset(offset)
      .where(where)
      .orderBy(orderBy)

    const totalResult = await db
      .select({
        count: count(),
      })
      .from(users)
      .where(where)
      
    const total = totalResult[0]?.count ?? 0

        const pageCount = Math.ceil(total / perPage)
        return { data, pageCount }
      } catch {
        return { data: [], pageCount: 0 }
      }
    },
    [`users-${JSON.stringify(input)}`],
    {
      revalidate: 3600, // every hour
      tags: [`users`],
    }
  )()
}

export async function getUserById(id: string) {
  return await unstable_cache(
    async () => {
      try {
        const user = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            avatar: users.avatar,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          })
          .from(users)
          .where(eq(users.id, id))
          .limit(1)

        return user[0] ?? null
      } catch {
        return null
      }
    },
    [`user-${id}`],
    {
      revalidate: 3600,
      tags: [`user-${id}`, `users`],
    }
  )()
}

export async function getUserRoleCounts() {
  return await unstable_cache(
    async () => {
      try {
        const roleCounts = await db
          .select({
            role: users.role,
            count: count(),
          })
          .from(users)
          .groupBy(users.role)

        return {
          admin: roleCounts.find((item) => item.role === "admin")?.count ?? 0,
          user: roleCounts.find((item) => item.role === "user")?.count ?? 0,
        }
      } catch {
        return {
          admin: 0,
          user: 0,
        }
      }
    },
    ["user-role-counts"],
    {
      revalidate: 3600,
      tags: ["user-role-counts", `users`],
    }
  )()
}

export async function getUsersForExport() {
  try {
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    return data
  } catch {
    return []
  }
}
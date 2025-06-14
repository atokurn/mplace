import "server-only"

import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"
import { users, type SelectUser } from "@/lib/db/schema"
import { buildFilterWhere } from "@/lib/filter-columns"
import { usersSearchParamsCache } from "@/lib/search-params"
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm"

export async function getUsers(input: ReturnType<typeof usersSearchParamsCache.parse>) {
  return await unstable_cache(
    async () => {
      const { page, per_page, sort, name, email, role, operator } = input

      try {
        // Offset to paginate the results
        const offset = (page - 1) * per_page

        // Column and order to sort by
        // Spliting the sort string by "." to get the column and order
        // Example: "title.desc" => ["title", "desc"]
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
          "createdAt",
          "desc",
        ]) as [keyof SelectUser | undefined, "asc" | "desc" | undefined]

        // Convert the column name to the actual column in the database
        // And sort by the column in the specified order
        const orderBy =
          column && column in users
            ? order === "asc"
              ? asc(users[column])
              : desc(users[column])
            : desc(users.createdAt)

        const expressions = [
          name
            ? ilike(users.name, `%${name}%`)
            : undefined,
          email
            ? ilike(users.email, `%${email}%`)
            : undefined,
          role
            ? eq(users.role, role)
            : undefined,
        ].filter(Boolean)

        const where = buildFilterWhere({
          column: "name",
          value: expressions,
          operator,
          isSelectable: false,
        })

        // Transaction is used to ensure both queries are executed in a single transaction
        const { data, total } = await db.transaction(async (tx) => {
          const data = await tx
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
            .limit(per_page)
            .offset(offset)
            .where(where)
            .orderBy(orderBy)

          const total = await tx
            .select({
              count: count(),
            })
            .from(users)
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

          return {
            data,
            total,
          }
        })

        const pageCount = Math.ceil(total / per_page)
        return { data, pageCount }
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
        return {
          admin: 0,
          user: 0,
        }
      }
    },
    ["user-role-counts"],
    {
      revalidate: 3600,
      tags: ["users"],
    }
  )()
}

export async function getUsersForExport() {
  return await unstable_cache(
    async () => {
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
      } catch (err) {
        return []
      }
    },
    ["users-export"],
    {
      revalidate: 3600,
      tags: ["users"],
    }
  )()
}
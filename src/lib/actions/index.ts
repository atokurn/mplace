"use server";

import { db } from "@/lib/db";
import { getErrorMessage } from "@/lib/handle-error";
import { takeFirstFromReturning } from "@/lib/db/utils";
import { eq, inArray, type SQL } from "drizzle-orm";
import { revalidateTag, unstable_noStore } from "next/cache";
import { type AnyPgTable } from "drizzle-orm/pg-core";

// Define a more specific table type that includes an 'id' column
// This avoids linter errors about 'id' not existing on 'AnyPgTable'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableWithId = AnyPgTable & { id: any };

export async function deleteSingle<T extends TableWithId>({
  table,
  id,
  revalidateTagName,
  preDelete,
}: {
  table: T;
  id: string;
  revalidateTagName: string;
  preDelete?: (id: string) => Promise<void>;
}) {
  unstable_noStore();
  try {
    if (preDelete) {
      await preDelete(id);
    }
    const deleted = await takeFirstFromReturning(
      db.delete(table).where(eq(table.id, id)).returning()
    );

    revalidateTag(revalidateTagName);

    return {
      data: deleted ?? null,
      error: null as string | null,
    } as const;
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    } as const;
  }
}

export async function deleteMultiple<T extends TableWithId>({
  table,
  ids,
  revalidateTagName,
  preDelete,
}: {
  table: T;
  ids: string[];
  revalidateTagName: string;
  preDelete?: (ids: string[]) => Promise<void>;
}) {
  unstable_noStore();
  try {
    if (preDelete) {
      await preDelete(ids);
    }
    const deleted = await db
      .delete(table)
      .where(inArray(table.id, ids))
      .returning();

    revalidateTag(revalidateTagName);

    return {
      data: deleted,
      error: null as string | null,
    } as const;
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    } as const;
  }
}
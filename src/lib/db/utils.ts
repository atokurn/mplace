export function takeFirstOrThrow<T extends Record<string, unknown>>(
  values: T[],
): T {
  if (values.length === 0) {
    throw new Error("Expected at least one result, but got none");
  }
  return values[0]!;
}

export function takeFirst<T extends Record<string, unknown>>(
  values: T[],
): T | undefined {
  return values[0];
}

// Accepts either an array of rows or an object with a `rows` array (e.g., NeonHttpQueryResult)
export function takeFirstFromReturning<T extends Record<string, unknown>>(value: unknown): T {
  let rowsUnknown: unknown = value;

  if (!Array.isArray(rowsUnknown)) {
    if (rowsUnknown && typeof rowsUnknown === "object" && "rows" in rowsUnknown) {
      const maybeRows = (rowsUnknown as { rows?: unknown }).rows;
      rowsUnknown = maybeRows;
    }
  }

  if (!Array.isArray(rowsUnknown) || rowsUnknown.length === 0) {
    throw new Error("Expected at least one result, but got none");
  }

  return rowsUnknown[0] as T;
}
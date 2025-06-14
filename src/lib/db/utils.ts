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
import { SQL, and, or, eq, ne, ilike, notIlike, isNull, isNotNull, gte, lte, gt, lt } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  multiple?: boolean;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    withCount?: boolean;
  }[];
}

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: 'text' | 'select' | 'date' | 'boolean';
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: {
    label: string;
    value: string;
    count?: number;
  }[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}

/**
 * Filters an array of columns based on the provided filter values and operator.
 * @param columns - The columns to filter.
 * @param filterValues - The filter values.
 * @param operator - The filter operator.
 * @returns The filtered columns.
 */
export function filterColumns<T extends Record<string, any>>(
  columns: T[],
  filterValues: string[],
  operator: 'and' | 'or' = 'and'
): T[] {
  if (!filterValues.length) return columns;

  return columns.filter((column) => {
    if (!column || typeof column !== 'object') return false;
    const values = Object.values(column).map((value) =>
      String(value).toLowerCase()
    );

    if (operator === 'and') {
      return filterValues.every((filterValue) =>
        values.some((value) => value.includes(filterValue.toLowerCase()))
      );
    } else {
      return filterValues.some((filterValue) =>
        values.some((value) => value.includes(filterValue.toLowerCase()))
      );
    }
  });
}

/**
 * Builds a SQL where clause based on the provided filters.
 * @param filters - The filters to apply.
 * @param operator - The operator to use when combining filters.
 * @returns The SQL where clause.
 */
export function buildFilterWhere(
  filters: Array<{
    column: PgColumn;
    value: any;
    operator?: 'eq' | 'ne' | 'ilike' | 'notIlike' | 'isNull' | 'isNotNull' | 'gte' | 'lte' | 'gt' | 'lt';
  }>,
  operator: 'and' | 'or' = 'and'
): SQL | undefined {
  if (!filters.length) return undefined;

  const conditions = filters.map(({ column, value, operator: filterOperator = 'eq' }) => {
    switch (filterOperator) {
      case 'eq':
        return eq(column, value);
      case 'ne':
        return ne(column, value);
      case 'ilike':
        return ilike(column, `%${value}%`);
      case 'notIlike':
        return notIlike(column, `%${value}%`);
      case 'isNull':
        return isNull(column);
      case 'isNotNull':
        return isNotNull(column);
      case 'gte':
        return gte(column, value);
      case 'lte':
        return lte(column, value);
      case 'gt':
        return gt(column, value);
      case 'lt':
        return lt(column, value);
      default:
        return eq(column, value);
    }
  });

  return operator === 'and' ? and(...conditions) : or(...conditions);
}

/**
 * Gets the available filter operators for a given data type.
 * @param type - The data type.
 * @returns The available filter operators.
 */
export function getFilterOperators(type: 'text' | 'select' | 'date' | 'boolean' | 'number') {
  switch (type) {
    case 'text':
      return [
        { label: 'Contains', value: 'ilike' },
        { label: 'Does not contain', value: 'notIlike' },
        { label: 'Is', value: 'eq' },
        { label: 'Is not', value: 'ne' },
        { label: 'Is empty', value: 'isNull' },
        { label: 'Is not empty', value: 'isNotNull' },
      ];
    case 'select':
    case 'boolean':
      return [
        { label: 'Is', value: 'eq' },
        { label: 'Is not', value: 'ne' },
      ];
    case 'date':
    case 'number':
      return [
        { label: 'Is', value: 'eq' },
        { label: 'Is not', value: 'ne' },
        { label: 'Is after', value: 'gt' },
        { label: 'Is on or after', value: 'gte' },
        { label: 'Is before', value: 'lt' },
        { label: 'Is on or before', value: 'lte' },
        { label: 'Is empty', value: 'isNull' },
        { label: 'Is not empty', value: 'isNotNull' },
      ];
    default:
      return [
        { label: 'Is', value: 'eq' },
        { label: 'Is not', value: 'ne' },
      ];
  }
}
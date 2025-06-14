"use client";

import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  type Parser,
  type UseQueryStateOptions,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import * as React from "react";

import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getSortingStateParser } from "@/lib/parsers";
import type { ExtendedColumnSort } from "@/types/data-table";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  history?: "push" | "replace";
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    history = "replace",
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;

  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, "parse">
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ],
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1),
  );
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10),
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[],
    );
  }, [columns]);

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? []),
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting],
  );

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) {
      // For advanced filter, include all columns that have meta information for filtering
      return columns.filter((column) => column.meta && (column.meta.variant || column.meta.options));
    }

    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  const filterParsers = React.useMemo(() => {
    return filterableColumns.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, column) => {
      if (column.meta?.options || column.meta?.variant === 'multiSelect') {
        acc[column.id ?? ""] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR,
        ).withOptions(queryStateOptions);
      } else if (column.meta?.variant === 'dateRange') {
        // For date range filters, we need to handle array of timestamps
        acc[column.id ?? ""] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR,
        ).withOptions(queryStateOptions);
      } else {
        acc[column.id ?? ""] = parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterableColumns, queryStateOptions]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof filterValues) => {
      void setPage(1);
      void setFilterValues(values);
    },
    debounceMs,
  );

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (!filterValues || typeof filterValues !== 'object' || Array.isArray(filterValues)) return [];

    try {
      return Object.entries(filterValues).reduce<ColumnFiltersState>(
        (filters, [key, value]) => {
          if (value !== null) {
            const column = filterableColumns.find(col => col.id === key);
            
            let processedValue;
            if (column?.meta?.variant === 'dateRange' && Array.isArray(value)) {
              // For date range, convert string timestamps to numbers
              processedValue = value.map(v => v ? Number(v) : undefined).filter(v => v !== undefined);
            } else if (column?.meta?.variant === 'text') {
              // For text filters, keep as single string
              processedValue = Array.isArray(value) ? value[0] : String(value); // Ensure string for single value
            } else if (column?.meta?.variant === 'multiSelect' || (column?.meta?.options && column.id === 'category')) {
              // For multi-select and category filters, ensure array of strings
              processedValue = Array.isArray(value) ? value.map(String) : [String(value)];
            } else if (column?.meta?.variant === 'range' && column.id === 'price') {
              // For price range filters, ensure array of two strings (numbers as strings)
              processedValue = Array.isArray(value) && value.length === 2 ? value.map(String) : (Array.isArray(value) && value.length === 1 ? [String(value[0]), String(value[0])] : []);
            } else if (column?.meta?.variant === 'range') {
              // For other range filters, ensure array
              processedValue = Array.isArray(value) ? value : [value];
            } else if (column?.meta?.options) { // General faceted filters (like status)
              processedValue = Array.isArray(value) ? value.map(String) : [String(value)];
            } else {
              // Default behavior - keep original value
              processedValue = value;
            }

            if (processedValue !== undefined && ( (Array.isArray(processedValue) && processedValue.length > 0) || !Array.isArray(processedValue) ) ) {
              filters.push({
                id: key,
                value: processedValue,
              });
            }
          }
          return filters;
        },
        [],
      );
    } catch (error) {
      console.error('Error in initialColumnFilters:', error, 'filterValues:', filterValues);
      return [];
    }
  }, [filterValues, filterableColumns]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;

        if (enableAdvancedFilter) {
          // For advanced filter, we handle all column filters
          const filterUpdates = next.reduce<
            Record<string, string | string[] | null>
          >((acc, filter) => {
            const column = filterableColumns.find(col => col.id === filter.id);
            
            if (column?.meta?.variant === 'dateRange' && Array.isArray(filter.value)) {
              // For date range, convert numbers to strings for URL
              acc[filter.id] = filter.value.map(v => v ? String(v) : '').filter(Boolean);
            } else {
              acc[filter.id] = filter.value as string | string[];
            }
            return acc;
          }, {});

          // Clear filters that are no longer present
          for (const prevFilter of prev) {
            if (!next.some((filter) => filter.id === prevFilter.id)) {
              filterUpdates[prevFilter.id] = null;
            }
          }

          debouncedSetFilterValues(filterUpdates);
        } else {
          // For basic filter, only handle filterable columns
          const filterUpdates = next.reduce<
            Record<string, string | string[] | null>
          >((acc, filter) => {
            if (filterableColumns.find((column) => column.id === filter.id)) {
              acc[filter.id] = filter.value as string | string[];
            }
            return acc;
          }, {});

          for (const prevFilter of prev) {
            if (!next.some((filter) => filter.id === prevFilter.id)) {
              filterUpdates[prevFilter.id] = null;
            }
          }

          debouncedSetFilterValues(filterUpdates);
        }

        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter],
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, shallow, debounceMs, throttleMs };
}

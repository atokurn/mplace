import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsJson,
} from 'nuqs/server';
import { z } from 'zod';

// Filter parser for advanced filters
const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string()), z.number(), z.array(z.number())]),
  operator: z.string().optional(),
});

function getFiltersStateParser() {
  return parseAsJson((obj) => {
    const result = z.array(filterItemSchema).safeParse(obj);
    return result.success ? result.data : null;
  });
}

// Products search params
export const productsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('createdAt.desc'),
  title: parseAsString.withDefault(''),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  price: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  status: parseAsArrayOf(parseAsString).withDefault([]),
  isActive: parseAsArrayOf(parseAsString).withDefault([]),
  operator: parseAsStringEnum(['and', 'or']).withDefault('and'),
  filterFlag: parseAsString.withDefault(''),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and'),
});

// Categories search params
export const categoriesSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('createdAt.desc'),
  name: parseAsString.withDefault(''),
  description: parseAsString.withDefault(''),
  isActive: parseAsArrayOf(parseAsString).withDefault([]),
  operator: parseAsStringEnum(['and', 'or']).withDefault('and'),
});

export const usersSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('createdAt.desc'),
  name: parseAsString.withDefault(''),
  email: parseAsString.withDefault(''),
  role: parseAsArrayOf(parseAsStringEnum(['user', 'admin'])).withDefault([]),
  operator: parseAsStringEnum(['and', 'or']).withDefault('and'),
});

export const ordersSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('createdAt.desc'),
  orderNumber: parseAsString.withDefault(''),
  status: parseAsStringEnum(['pending', 'processing', 'completed', 'cancelled', 'refunded']).withDefault('pending'),
  paymentStatus: parseAsStringEnum(['pending', 'paid', 'failed', 'refunded']).withDefault('pending'),
  operator: parseAsStringEnum(['and', 'or']).withDefault('and'),
});

export const analyticsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault("createdAt.desc"),
  eventType: parseAsArrayOf(parseAsStringEnum(["page_view", "product_view", "add_to_cart", "purchase", "search"])).withDefault([]),
  userId: parseAsString.withDefault(""),
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
})

export const settingsSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault("createdAt.desc"),
  key: parseAsString.withDefault(""),
  category: parseAsArrayOf(parseAsStringEnum(["general", "payment", "email", "storage"])).withDefault([]),
  isPublic: parseAsBoolean.withDefault(false),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const dashboardSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault("createdAt.desc"),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const productsSearchParamsSerializer = createSerializer({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault('createdAt.desc'),
  title: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  price: parseAsArrayOf(parseAsString).withDefault([]),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  isActive: parseAsArrayOf(parseAsString).withDefault([]),
  operator: parseAsStringEnum(['and', 'or']).withDefault('and'),
});

// Valid filters for products
export function getValidFilters() {
  return [
    {
      id: 'title',
      label: 'Title',
      type: 'text' as const,
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select' as const,
    },
    {
      id: 'isActive',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
      ],
    },
  ];
}

// Sort options for products
export function getSortOptions() {
  return [
    {
      label: 'Created Date (Newest)',
      value: 'createdAt.desc',
    },
    {
      label: 'Created Date (Oldest)',
      value: 'createdAt.asc',
    },
    {
      label: 'Title (A-Z)',
      value: 'title.asc',
    },
    {
      label: 'Title (Z-A)',
      value: 'title.desc',
    },
    {
      label: 'Price (Low to High)',
      value: 'price.asc',
    },
    {
      label: 'Price (High to Low)',
      value: 'price.desc',
    },
    {
      label: 'Views (Most)',
      value: 'viewCount.desc',
    },
    {
      label: 'Views (Least)',
      value: 'viewCount.asc',
    },
  ];
}

// Helper to parse search params from URL
export function parseSearchParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>) {
  if (searchParams instanceof URLSearchParams) {
    const params: Record<string, string | string[]> = {};
    for (const [key, value] of (searchParams ? searchParams.entries() : [])) {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    }
    return productsSearchParamsCache.parse(params);
  }
  return productsSearchParamsCache.parse(searchParams);
}
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import CatalogClient from '@/app/_components/features/public/catalog/CatalogClient';
import { productsSearchParamsCache } from '@/lib/search-params';
import { getProducts } from '@/app/_lib/queries/products';
import type { GetProductsSchema } from '@/app/_lib/validations/products';
import type { FilterItemSchema } from '@/lib/parsers';

interface CatalogPageProps {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    sort?: string | string[];
    page?: string;
    limit?: string;
    price?: string | string[];
    tags?: string | string[];
  }>;
}

export const metadata: Metadata = {
  title: 'Catalog | FLATMARKET',
  description: 'Browse our catalog of high-quality products',
};

function mapSort(sort?: string): string | undefined {
  if (!sort) return undefined;
  // Pass-through if already in the form field.direction
  if (/^[a-zA-Z0-9_]+\.(asc|desc)$/.test(sort)) return sort;
  switch (sort) {
    case 'title-asc':
      return 'title.asc';
    case 'title-desc':
      return 'title.desc';
    case 'price-asc':
      return 'price.asc';
    case 'price-desc':
      return 'price.desc';
    case 'newest':
      return 'createdAt.desc';
    case 'oldest':
      return 'createdAt.asc';
    default:
      return undefined;
  }
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const sp = await searchParams;

  // Normalize incoming search params to the expected keys for productsSearchParamsCache
  const sortRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const categoryRaw = Array.isArray(sp.category)
    ? sp.category
    : typeof sp.category === 'string'
    ? [sp.category]
    : undefined;
  const priceRaw = Array.isArray(sp.price)
    ? sp.price
    : typeof sp.price === 'string'
    ? [sp.price]
    : undefined;
  const tagsRaw = Array.isArray(sp.tags)
    ? sp.tags
    : typeof sp.tags === 'string'
    ? [sp.tags]
    : undefined;

  const raw: Record<string, string | string[] | undefined> = {
    page: sp.page,
    perPage: sp.limit,
    sort: mapSort(sortRaw),
    title: typeof sp.search === 'string' ? sp.search : undefined,
    category: categoryRaw,
    price: priceRaw,
    tags: tagsRaw,
  };

  const parsed = productsSearchParamsCache.parse(raw);

  // Shape the parsed object to match GetProductsSchema
  const serverInput: GetProductsSchema = {
    page: parsed.page,
    perPage: parsed.perPage,
    sort: parsed.sort,
    title: parsed.title,
    category: parsed.category,
    price: parsed.price,
    tags: parsed.tags,
    status: parsed.status,
    isActive: parsed.isActive,
    operator: parsed.operator,
    filterFlag: parsed.filterFlag,
    filters: Array.isArray(parsed.filters) ? (parsed.filters as FilterItemSchema[]) : [],
    joinOperator: parsed.joinOperator,
  };

  // Fetch products directly via server action (no API hop)
  const { data, pageCount, total } = await getProducts(serverInput);

  // Normalize products for CatalogClient
  const initialProducts = (Array.isArray(data) ? data : []).map((p) => {
    const priceNum = typeof p.price === 'string' ? parseFloat(p.price) : (p.price as unknown as number);
    const createdAtStr = p.createdAt instanceof Date ? p.createdAt.toISOString() : (typeof p.createdAt === 'string' ? p.createdAt : '');
    return {
      id: p.id ?? '',
      title: p.title ?? '',
      tags: Array.isArray(p.tags) ? p.tags : [],
      price: Number.isFinite(priceNum) ? priceNum : 0,
      image: p.imageUrl || p.thumbnailUrl || '/placeholder.svg',
      description: p.description ?? '',
      category: p.category ?? '',
      createdAt: createdAtStr,
      featured: false,
    };
  });

  // Compute pagination shape expected by CatalogClient
  const currentPage = serverInput.page ?? 1;
  const perPage = serverInput.perPage ?? 12;
  const totalPages = pageCount ?? 0;
  const initialPagination = {
    currentPage,
    totalPages,
    totalProducts: typeof total === 'number' ? total : totalPages * perPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  const initialFilters = {
    category: Array.isArray(serverInput.category) && serverInput.category.length > 0 ? String(serverInput.category[0]) : undefined,
    search: serverInput.title || undefined,
    sortBy: (serverInput.sort && serverInput.sort.split('.')[0]) || undefined,
    sortOrder: (serverInput.sort && serverInput.sort.split('.')[1]) || undefined,
  } as const;

  return (
    <>
      <Header />
      <CatalogClient
        initialProducts={initialProducts}
        initialPagination={initialPagination}
        initialFilters={initialFilters}
      />
    </>
  );
}
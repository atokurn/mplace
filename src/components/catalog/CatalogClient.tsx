'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/products/ProductCard';
import Sheet from '@/components/ui/Sheet';
import { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  tags: string[];
  price: number;
  image: string;
  description: string;
  category: string;
  downloads: number;
  rating: number;
  createdAt: string;
  featured: boolean;
}

interface CatalogClientProps {
  initialProducts: Product[];
  initialPagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  initialFilters: {
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

const CatalogClient = ({ initialProducts, initialPagination, initialFilters }: CatalogClientProps) => {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder || 'desc');
  const [filterTag, setFilterTag] = useState(initialFilters.category || 'all');
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  // Update URL when filters change
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/catalog?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search: searchQuery });
  };

  const handleFilterChange = (category: string) => {
    setFilterTag(category);
    updateURL({ category });
    setIsFilterSheetOpen(false);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    updateURL({ sortBy: newSortBy, sortOrder: newSortOrder });
    setIsSortSheetOpen(false);
  };

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'background', name: 'Backgrounds' },
    { id: 'illustration', name: 'Illustrations' },
    { id: '3d', name: '3D Assets' },
    { id: 'texture', name: 'Textures' },
    { id: 'pattern', name: 'Patterns' },
    { id: 'artistic', name: 'Artistic' }
  ];

  const sortOptions = [
    { id: 'createdAt-desc', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
    { id: 'createdAt-asc', label: 'Oldest First', sortBy: 'createdAt', sortOrder: 'asc' },
    { id: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
    { id: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
    { id: 'title-asc', label: 'Name: A to Z', sortBy: 'title', sortOrder: 'asc' },
    { id: 'title-desc', label: 'Name: Z to A', sortBy: 'title', sortOrder: 'desc' },
    { id: 'downloads-desc', label: 'Most Popular', sortBy: 'downloads', sortOrder: 'desc' },
    { id: 'rating-desc', label: 'Highest Rated', sortBy: 'rating', sortOrder: 'desc' }
  ];

  return (
    <div>
      {/* Search Bar */}
      <section className="border-t border-b border-border bg-background">
        <div className="w-full">
          <div className="flex items-center h-20 px-4 justify-center">
            <div className="relative w-full max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Sort Section */}
      <section className="border-b border-border bg-background sticky top-16 z-40">
        <div className="w-full">
          {/* Filter and Sort Controls */}
          <div className="flex items-center h-12">
            {/* Products Count */}
            <div className="flex-1 px-4 border-r border-border h-full flex items-center">
              <p className="orbitron-font text-xs text-muted-foreground font-medium">
                {initialProducts.length} PRODUCTS
              </p>
            </div>
            
            {/* Filter Button */}
            <div className="border-r border-border h-full">
              <button
                onClick={() => setIsFilterSheetOpen(true)}
                className="flex items-center gap-2 px-4 h-full hover:bg-secondary/50 transition-colors"
              >
                <Filter size={16} className="text-accent" />
                <span className="orbitron-font text-foreground font-medium text-xs">FILTER</span>
                <span className="orbitron-font text-xs text-muted-foreground">({filterTag.toUpperCase()})</span>
              </button>
            </div>

            {/* Sort Button */}
            <div className="h-full">
              <button
                onClick={() => setIsSortSheetOpen(true)}
                className="flex items-center gap-2 px-4 h-full hover:bg-secondary/50 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc size={16} className="text-accent" /> : <SortDesc size={16} className="text-accent" />}
                <span className="orbitron-font text-foreground font-medium text-xs">SORT</span>
                <span className="orbitron-font text-xs text-muted-foreground">({sortBy.toUpperCase()} {sortOrder.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-0">
        <div className="w-full">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {initialProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/products/${product.id}`}>
                  <ProductCard
                    title={product.title}
                    tags={product.tags}
                    price={product.price}
                    image={product.image}
                    index={index}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          {/* No results message */}
          {initialProducts.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="orbitron-font text-muted-foreground text-sm mb-2">
                 NO PRODUCTS FOUND
               </p>
               <p className="text-xs text-muted-foreground">
                 Try adjusting your filters or search terms
               </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {initialPagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          {initialPagination.hasPrevPage && (
            <Link
              href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(initialPagination.currentPage - 1) }).toString()}`}
              className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border rounded-xl hover:bg-card-bg/80 transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </Link>
          )}
          
          <span className="text-sm text-muted-foreground">
            Page {initialPagination.currentPage} of {initialPagination.totalPages}
          </span>
          
          {initialPagination.hasNextPage && (
            <Link
              href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(initialPagination.currentPage + 1) }).toString()}`}
              className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border rounded-xl hover:bg-card-bg/80 transition-colors"
            >
              Next
              <ChevronRight size={20} />
            </Link>
          )}
        </div>
      )}

      {/* Filter Sheet */}
      <Sheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        title="Filter Products"
        side="right"
      >
        <div className="space-y-4">
          <div>
            <label className="orbitron-font text-xs font-medium text-foreground mb-2 block">
              CATEGORY
            </label>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors border ${
                    filterTag === category.id
                      ? 'bg-accent text-background font-medium border-accent'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'
                  }`}
                >
                  {category.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>

      {/* Sort Sheet */}
      <Sheet
        isOpen={isSortSheetOpen}
        onClose={() => setIsSortSheetOpen(false)}
        title="Sort Products"
        side="right"
      >
        <div className="space-y-6">
          <div>
            <label className="orbitron-font text-xs font-medium text-foreground mb-2 block">
              SORT BY
            </label>
            <div className="space-y-2">
              {[{ value: 'title', label: 'NAME' }, { value: 'price', label: 'PRICE' }, { value: 'createdAt', label: 'DATE' }].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors border ${
                    sortBy === option.value
                      ? 'bg-accent text-background font-medium border-accent'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="orbitron-font text-xs font-medium text-foreground mb-2 block">
              ORDER
            </label>
            <div className="space-y-2">
              {[{ value: 'asc', label: 'ASCENDING' }, { value: 'desc', label: 'DESCENDING' }].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSortOrder(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors border ${
                    sortOrder === option.value
                      ? 'bg-accent text-background font-medium border-accent'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setIsSortSheetOpen(false)}
            className="w-full orbitron-font bg-accent text-background px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors text-xs font-medium border border-accent"
          >
            APPLY SORT
          </button>
        </div>
      </Sheet>
    </div>
  );
};

export default CatalogClient;
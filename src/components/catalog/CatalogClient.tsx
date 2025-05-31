'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/products/ProductCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  
  // New filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);

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
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange({ min: '', max: '' });
  };

  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedTags.length + 
           (priceRange.min || priceRange.max ? 1 : 0);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    updateURL({ sortBy: newSortBy, sortOrder: newSortOrder });
    setIsSortSheetOpen(false);
  };

  const categories = [
    { id: 'background', name: 'Backgrounds', color: 'bg-blue-500' },
    { id: 'illustration', name: 'Illustrations', color: 'bg-green-500' },
    { id: '3d', name: '3D Assets', color: 'bg-purple-500' },
    { id: 'texture', name: 'Textures', color: 'bg-orange-500' },
    { id: 'pattern', name: 'Patterns', color: 'bg-pink-500' },
    { id: 'artistic', name: 'Artistic', color: 'bg-yellow-500' },
    { id: 'ui-kit', name: 'UI Kits', color: 'bg-red-500' },
    { id: 'icons', name: 'Icons', color: 'bg-indigo-500' },
    { id: 'fonts', name: 'Fonts', color: 'bg-teal-500' },
    { id: 'mockups', name: 'Mockups', color: 'bg-cyan-500' }
  ];
  
  const popularTags = [
    'Abstract', 'Modern', 'Minimalist', 'Colorful', 'Dark', 'Light',
    'Geometric', 'Organic', 'Vintage', 'Futuristic', 'Nature', 'Urban',
    'Professional', 'Creative', 'Elegant', 'Bold', 'Subtle', 'Gradient'
  ];
  
  const visibleCategories = showMoreCategories ? categories : categories.slice(0, 6);
  const visibleTags = showMoreTags ? popularTags : popularTags.slice(0, 8);

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
        {initialProducts.length > 0 ? (
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
                <ProductCard
                  id={product.id}
                  title={product.title}
                  tags={product.tags}
                  price={product.price}
                  image={product.image}
                  index={index}
                  downloads={product.downloads}
                  rating={product.rating}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* No results message */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-muted-foreground text-lg mb-2">No products found</div>
            <div className="text-muted-foreground text-sm">Try adjusting your search or filters</div>
          </motion.div>
        )}
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
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-full">
          <SheetHeader>
            <SheetTitle className="orbitron-font text-lg font-medium text-foreground uppercase">FILTER</SheetTitle>
          </SheetHeader>
          <div className="h-full flex flex-col mt-4">          
            {/* Active Filters Count & Clear */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center justify-between p-4 bg-secondary/30 border-b border-border">
                <span className="text-xs text-muted-foreground">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} applied
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
            
            {/* Scrollable Filter Content */}
            <ScrollArea className="flex-1 pr-4">
              {/* Categories Section */}
              <div className="border-b border-border">
                <div className="p-4">
                  <h3 className="orbitron-font text-xs font-medium text-foreground mb-3 uppercase">Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                     {visibleCategories.map(category => (
                       <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                         <div className="relative">
                           <input
                             type="checkbox"
                             checked={selectedCategories.includes(category.id)}
                             onChange={() => handleCategoryToggle(category.id)}
                             className="sr-only"
                           />
                           <div className={`w-4 h-4 rounded border-2 transition-all ${
                             selectedCategories.includes(category.id)
                               ? 'bg-accent border-accent'
                               : 'border-border group-hover:border-accent/50'
                           }`}>
                             {selectedCategories.includes(category.id) && (
                               <div className="w-full h-full flex items-center justify-center">
                                 <div className="w-2 h-2 bg-background rounded-sm" />
                               </div>
                             )}
                           </div>
                         </div>
                         <div className="flex items-center gap-1.5 flex-1 min-w-0">
                           <div className={`w-3 h-3 rounded-full flex-shrink-0 ${category.color}`} />
                           <span className="text-sm text-foreground group-hover:text-accent transition-colors truncate">
                             {category.name}
                           </span>
                         </div>
                       </label>
                     ))}
                  </div>
                  
                  {categories.length > 6 && (
                    <button
                      onClick={() => setShowMoreCategories(!showMoreCategories)}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors mt-3"
                    >
                      {showMoreCategories ? (
                        <>
                          <ChevronUp size={14} />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          Show more ({categories.length - 6})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              <div className="border-b border-border">
                <div className="p-4">
                  <h3 className="orbitron-font text-xs font-medium text-foreground mb-3 uppercase">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {visibleTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${
                          selectedTags.includes(tag)
                            ? 'bg-accent text-background border-accent'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  
                  {popularTags.length > 8 && (
                    <button
                      onClick={() => setShowMoreTags(!showMoreTags)}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors mt-3"
                    >
                      {showMoreTags ? (
                        <>
                          <ChevronUp size={14} />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          Show more ({popularTags.length - 8})
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range Section */}
              <div className="p-4">
                <h3 className="orbitron-font text-xs font-medium text-foreground mb-3 uppercase">Price Range</h3>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Quick Price Filters */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Free', min: '0', max: '0' },
                    { label: 'Under $10', min: '0', max: '10' },
                    { label: '$10 - $25', min: '10', max: '25' },
                    { label: '$25 - $50', min: '25', max: '50' },
                    { label: 'Over $50', min: '50', max: '' }
                  ].map(range => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors border ${
                        priceRange.min === range.min && priceRange.max === range.max
                          ? 'bg-accent text-background border-accent'
                          : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>

            {/* Sticky Apply Button */}
            <div className="sticky bottom-0 bg-background border-t p-4 pt-4 mt-4">
            <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-full orbitron-font bg-accent text-background px-4 py-3 rounded-xl hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sort Sheet */}
      <Sheet open={isSortSheetOpen} onOpenChange={setIsSortSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-full">
          <SheetHeader>
            <SheetTitle className="orbitron-font text-lg font-medium text-foreground uppercase">Sort Products</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 p-4">
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CatalogClient;
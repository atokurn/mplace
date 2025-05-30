'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/products/ProductCard';
import Header from '@/components/layout/Header';
import Sheet from '@/components/ui/Sheet';
import { useState } from 'react';
import { Filter, SortAsc, SortDesc, Search } from 'lucide-react';

const CatalogPage = () => {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterTag, setFilterTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  // Sample products data - in a real app, this would come from an API
  const products = [
    {
      id: 1,
      title: 'Vibrant background',
      tags: ['Digital', 'Background', 'Colorful'],
      price: 12,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Man with leaves',
      tags: ['Portrait', 'Nature', 'Digital'],
      price: 38,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: '3D spheres',
      tags: ['3D', 'Abstract', 'Modern'],
      price: 15,
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Grunge texture',
      tags: ['Texture', 'Grunge', 'Vintage'],
      price: 55,
      image: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'Abstract patterns',
      tags: ['Abstract', 'Pattern', 'Geometric'],
      price: 25,
      image: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Neon lights',
      tags: ['Neon', 'Futuristic', 'Glow'],
      price: 42,
      image: '/placeholder.svg'
    },
    {
      id: 7,
      title: 'Geometric shapes',
      tags: ['Geometric', 'Minimal', 'Clean'],
      price: 18,
      image: '/placeholder.svg'
    },
    {
      id: 8,
      title: 'Digital landscape',
      tags: ['Landscape', 'Digital', 'Nature'],
      price: 65,
      image: '/placeholder.svg'
    },
    {
      id: 9,
      title: 'Cyberpunk city',
      tags: ['Cyberpunk', 'City', 'Futuristic'],
      price: 88,
      image: '/placeholder.svg'
    },
    {
      id: 10,
      title: 'Futuristic UI',
      tags: ['UI', 'Interface', 'Modern'],
      price: 35,
      image: '/placeholder.svg'
    },
    {
      id: 11,
      title: 'Space nebula',
      tags: ['Space', 'Nebula', 'Cosmic'],
      price: 72,
      image: '/placeholder.svg'
    },
    {
      id: 12,
      title: 'Digital portrait',
      tags: ['Portrait', 'Digital', 'Art'],
      price: 95,
      image: '/placeholder.svg'
    }
  ];

  // Get all unique tags for filter
  const allTags = ['all', ...new Set(products.flatMap(product => product.tags))];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesTag = filterTag === 'all' || product.tags.includes(filterTag);
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="orbitron-title text-4xl md:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('catalog').toUpperCase()}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover our complete collection of premium digital assets
          </motion.p>
        </div>
      </section>

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
                {filteredAndSortedProducts.length} PRODUCTS
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
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard
                  title={product.title}
                  tags={product.tags}
                  price={product.price}
                  image={product.image}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* No results message */}
          {filteredAndSortedProducts.length === 0 && (
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

      {/* Load More Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.button
            className="orbitron-font px-8 py-3 bg-accent text-background font-bold rounded-2xl hover:bg-accent/90 transition-colors text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LOAD MORE
          </motion.button>
        </div>
      </section>

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
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setFilterTag(tag);
                    setIsFilterSheetOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors border ${
                    filterTag === tag
                      ? 'bg-accent text-background font-medium border-accent'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'
                  }`}
                >
                  {tag.toUpperCase()}
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
              {[{ value: 'name', label: 'NAME' }, { value: 'price', label: 'PRICE' }].map(option => (
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

export default CatalogPage;
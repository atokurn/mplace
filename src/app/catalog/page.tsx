'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/products/ProductCard';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

const CatalogPage = () => {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterTag, setFilterTag] = useState('all');

  // Sample products data - in a real app, this would come from an API
  const products = [
    {
      id: 1,
      title: 'Vibrant background',
      tags: ['Digital', 'Background', 'Colorful'],
      price: 12,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Man with leaves',
      tags: ['Portrait', 'Nature', 'Digital'],
      price: 38,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: '3D spheres',
      tags: ['3D', 'Abstract', 'Modern'],
      price: 15,
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Grunge texture',
      tags: ['Texture', 'Grunge', 'Vintage'],
      price: 55,
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'Abstract patterns',
      tags: ['Abstract', 'Pattern', 'Geometric'],
      price: 25,
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      title: 'Neon lights',
      tags: ['Neon', 'Futuristic', 'Glow'],
      price: 42,
      image: '/api/placeholder/300/200'
    },
    {
      id: 7,
      title: 'Geometric shapes',
      tags: ['Geometric', 'Minimal', 'Clean'],
      price: 18,
      image: '/api/placeholder/300/200'
    },
    {
      id: 8,
      title: 'Digital landscape',
      tags: ['Landscape', 'Digital', 'Nature'],
      price: 65,
      image: '/api/placeholder/300/200'
    },
    {
      id: 9,
      title: 'Cyberpunk city',
      tags: ['Cyberpunk', 'City', 'Futuristic'],
      price: 88,
      image: '/api/placeholder/300/200'
    },
    {
      id: 10,
      title: 'Futuristic UI',
      tags: ['UI', 'Interface', 'Modern'],
      price: 35,
      image: '/api/placeholder/300/200'
    },
    {
      id: 11,
      title: 'Space nebula',
      tags: ['Space', 'Nebula', 'Cosmic'],
      price: 72,
      image: '/api/placeholder/300/200'
    },
    {
      id: 12,
      title: 'Digital portrait',
      tags: ['Portrait', 'Digital', 'Art'],
      price: 95,
      image: '/api/placeholder/300/200'
    }
  ];

  // Get all unique tags for filter
  const allTags = ['all', ...new Set(products.flatMap(product => product.tags))];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => filterTag === 'all' || product.tags.includes(filterTag))
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
            className="pixel-font text-4xl md:text-6xl font-bold text-foreground mb-6"
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

      {/* Filter and Sort Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-accent" />
                <span className="orbitron-font text-foreground font-medium text-xs">FILTER:</span>
              </div>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="orbitron-font bg-secondary text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-xs"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {sortOrder === 'asc' ? <SortAsc size={20} className="text-accent" /> : <SortDesc size={20} className="text-accent" />}
                <span className="orbitron-font text-foreground font-medium text-xs">SORT:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="orbitron-font bg-secondary text-foreground border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent mr-2 text-xs"
              >
                <option value="name">NAME</option>
                <option value="price">PRICE</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="orbitron-font bg-accent text-background px-3 py-2 rounded-lg hover:bg-accent/90 transition-colors text-xs"
              >
                {sortOrder === 'asc' ? 'ASC' : 'DESC'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
            <div className="text-center py-12">
              <p className="orbitron-font text-muted-foreground text-sm">
                 NO PRODUCTS FOUND
               </p>
            </div>
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
    </div>
  );
};

export default CatalogPage;
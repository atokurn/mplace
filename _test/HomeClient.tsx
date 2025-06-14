'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Star, Download, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/app/_components/shared/layouts/products/ProductCard';

interface Product {
  id: number;
  title: string;
  tags: string[];
  price: number;
  image: string;
}

interface Stats {
  totalDownloads: number;
  totalUsers: number;
  totalSales: number;
  totalRevenue: number;
}

interface HomeClientProps {
  featuredProducts: Product[];
  products: Product[];
  stats: Stats;
}

export function HomeClient({ featuredProducts, products, stats }: HomeClientProps) {
  const { t } = useLanguage();

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              className="orbitron-title text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              PIXEL
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('heroDescription')}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/catalog"
                className="orbitron-font inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-colors text-sm border border-accent group"
              >
                {t('exploreProducts').toUpperCase()}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="orbitron-font inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-bold hover:bg-secondary/50 transition-colors text-sm"
              >
                {t('learnMore').toUpperCase()}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <div className="orbitron-font text-2xl md:text-3xl font-bold text-foreground mb-2">
                {formatNumber(stats.totalDownloads)}+
              </div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div className="orbitron-font text-2xl md:text-3xl font-bold text-foreground mb-2">
                {formatNumber(stats.totalUsers)}+
              </div>
              <div className="text-sm text-muted-foreground">Users</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div className="orbitron-font text-2xl md:text-3xl font-bold text-foreground mb-2">4.9</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div className="orbitron-font text-2xl md:text-3xl font-bold text-foreground mb-2">
                {formatNumber(stats.totalSales)}+
              </div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredProducts').toUpperCase()}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium digital assets
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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
          </div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href="/catalog"
              className="orbitron-font inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-bold hover:bg-secondary/50 transition-colors text-sm"
            >
              {t('viewAll').toUpperCase()}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('latestProducts').toUpperCase()}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fresh additions to our growing collection
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('readyToStart').toUpperCase()}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators and find the perfect digital assets for your next project
            </p>
            <Link
              href="/signup"
              className="orbitron-font inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-colors text-sm border border-accent"
            >
              {t('getStarted').toUpperCase()}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default HomeClient;
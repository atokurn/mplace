'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import ProductCard from '@/app/_components/shared/layouts/products/ProductCard';

const featuredProducts = [
  {
    title: 'Vibrant background',
    price: 12,
    image: '/placeholder.svg',
    tags: ['Background', 'Abstract']
  },
  {
    title: 'Man with leaves',
    price: 8,
    image: '/placeholder.svg',
    tags: ['Vector', 'Illustration']
  },
  {
    title: '3D spheres',
    price: 15,
    image: '/placeholder.svg',
    tags: ['3D', 'Modern']
  },
  {
    title: 'Grunge texture',
    price: 5,
    image: '/placeholder.svg',
    tags: ['Texture', 'Grunge']
  }
];

const products = [
  {
    title: 'Vibrant background',
    price: 12,
    image: '/placeholder.svg',
    tags: ['Background', 'Abstract']
  },
  {
    title: 'Man with leaves',
    price: 8,
    image: '/placeholder.svg',
    tags: ['Vector', 'Illustration']
  },
  {
    title: 'Plant icon',
    price: 3,
    image: '/placeholder.svg',
    tags: ['Icon', 'Nature']
  },
  {
    title: 'Dark texture',
    price: 7,
    image: '/placeholder.svg',
    tags: ['Texture', 'Dark']
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-200 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="orbitron-title text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight">
                DIGITAL<br />
                ASSET<br />
                MARKETPL<br />
                ACE
              </h1>
              <motion.button
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-border"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                EXPLORE CATALOG
              </motion.button>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-black rounded-3xl p-8 aspect-square flex items-center justify-center">
                <motion.div
                  className="w-64 h-64 rounded-full"
                  style={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)'
                  }}
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Digital Items */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold text-center text-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Featured Digital Items
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                price={product.price}
                image={product.image}
                tags={product.tags}
                index={index}
              />
            ))}
          </div>
          
          <div className="text-center">
            <motion.button
              className="bg-secondary text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent hover:text-background transition-colors border border-border"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW ALL
            </motion.button>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="bg-gradient-to-br from-yellow-200 to-yellow-300 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="pixel-font text-4xl font-bold text-black mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Product
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                price={product.price}
                image={product.image}
                tags={product.tags}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
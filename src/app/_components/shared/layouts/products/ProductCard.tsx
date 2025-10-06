'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  tags: string[];
  index: number;
}

const ProductCard = ({ title, price, image, tags, index }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      className="bg-card-bg overflow-hidden product-card-hover border-r border-b border-border flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -3 }}
    >
      <div className="aspect-square relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Wishlist/Bookmark Button */}
        <motion.button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isWishlisted 
              ? 'bg-accent/20 text-accent' 
              : 'bg-black/20 text-white hover:bg-black/40'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            size={18} 
            className={`transition-all duration-200 ${
              isWishlisted ? 'fill-current' : ''
            }`}
          />
        </motion.button>
      </div>
      
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 mb-2 leading-snug min-h-[2.6rem] sm:min-h-[3rem]">
          {title}
        </h3>
        
        <div className="flex gap-1 sm:gap-2 mb-3 flex-nowrap overflow-hidden min-h-[1.25rem]">
          {tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground whitespace-nowrap">
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-muted-foreground px-2 py-1 whitespace-nowrap">
              +{tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="font-bold text-lg sm:text-xl text-foreground">
            ${price}
          </div>
          <motion.button
            className="text-xs sm:text-sm bg-accent text-muted px-3 py-1.5 hover:bg-accent/90 transition-colors font-medium border border-border"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VIEW
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
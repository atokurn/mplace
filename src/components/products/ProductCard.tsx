'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  tags: string[];
  index: number;
}

const ProductCard = ({ title, price, image, tags, index }: ProductCardProps) => {
  return (
    <motion.div
      className="bg-card-bg  overflow-hidden shadow-lg hover:shadow-[0_0_15px_rgba(0,255,153,0.3)] transition-all border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="aspect-square relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        
        <div className="flex flex-wrap gap-2 my-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-xs bg-secondary  px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-4 font-bold text-xl">
          ${price}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
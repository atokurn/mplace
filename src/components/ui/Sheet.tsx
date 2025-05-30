'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

const Sheet = ({ isOpen, onClose, children, title, side = 'right' }: SheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSheetVariants = () => {
    switch (side) {
      case 'left':
        return {
          hidden: { x: '-100%' },
          visible: { x: 0 },
          exit: { x: '-100%' }
        };
      case 'right':
        return {
          hidden: { x: '100%' },
          visible: { x: 0 },
          exit: { x: '100%' }
        };
      case 'top':
        return {
          hidden: { y: '-100%' },
          visible: { y: 0 },
          exit: { y: '-100%' }
        };
      case 'bottom':
        return {
          hidden: { y: '100%' },
          visible: { y: 0 },
          exit: { y: '100%' }
        };
      default:
        return {
          hidden: { x: '100%' },
          visible: { x: 0 },
          exit: { x: '100%' }
        };
    }
  };

  const getSheetClasses = () => {
    const baseClasses = 'fixed bg-background border-border z-50 shadow-2xl';
    
    switch (side) {
      case 'left':
        return `${baseClasses} left-0 top-0 h-full w-80 border-r`;
      case 'right':
        return `${baseClasses} right-0 top-0 h-full w-80 border-l`;
      case 'top':
        return `${baseClasses} top-0 left-0 w-full h-80 border-b`;
      case 'bottom':
        return `${baseClasses} bottom-0 left-0 w-full h-80 border-t`;
      default:
        return `${baseClasses} right-0 top-0 h-full w-80 border-l`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            className={getSheetClasses()}
            variants={getSheetVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="orbitron-font text-foreground font-semibold text-sm">
                {title.toUpperCase()}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sheet;
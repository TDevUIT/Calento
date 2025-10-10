'use client';

import { DropdownItem } from '@/config/app.config';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownMenuProps {
  items: readonly DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.95
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -10
  },
  visible: {
    opacity: 1,
    x: 0
  }
};

export function DropdownMenu({ items, isOpen, onClose }: DropdownMenuProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40" 
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          
          {/* Dropdown Menu */}
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              when: "beforeChildren",
              staggerChildren: 0.04
            }}
            className="absolute left-0 mt-2 w-72 z-50"
            onMouseEnter={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="bg-white dark:bg-cod-gray-900 rounded-xl shadow-2xl border border-cod-gray-200 dark:border-cod-gray-700 overflow-hidden backdrop-blur-sm"
            >
              <div className="p-2">
                {items.map((item) => (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    transition={{
                      duration: 0.2,
                      ease: [0, 0, 0.2, 1]
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950/30 dark:hover:to-blue-900/30 transition-all duration-200 group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-cod-gray-900 dark:text-cod-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-xs text-cod-gray-600 dark:text-cod-gray-400 mt-0.5 group-hover:text-cod-gray-700 dark:group-hover:text-cod-gray-300 transition-colors">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

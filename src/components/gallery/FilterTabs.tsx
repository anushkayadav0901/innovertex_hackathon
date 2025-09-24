import React from 'react'
import { motion } from 'framer-motion'

interface FilterTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function FilterTabs({ categories, activeCategory, onCategoryChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`filter-tab px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === category
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 active'
              : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {category}
          {activeCategory === category && (
            <motion.div
              className="absolute inset-0 bg-brand-500 rounded-full -z-10"
              layoutId="activeTab"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

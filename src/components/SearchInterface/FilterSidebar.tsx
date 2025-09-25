import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface RangeFilter {
  id: string;
  label: string;
  min: number;
  max: number;
  value: [number, number];
  unit?: string;
  step?: number;
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'tags';
  options?: FilterOption[];
  range?: RangeFilter;
  isCollapsed?: boolean;
}

interface FilterSidebarProps {
  filters: FilterSection[];
  selectedFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearAll: () => void;
  className?: string;
}

const AnimatedCheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
  color?: string;
}> = ({ checked, onChange, label, count, color = '#3b82f6' }) => {
  return (
    <motion.label
      whileHover={{ x: 2 }}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
    >
      <div className="relative">
        <motion.div
          className={`w-5 h-5 rounded border-2 transition-colors ${
            checked
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
      </div>
      
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
          {label}
        </span>
        {count !== undefined && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>
      
      {color && (
        <div
          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: color }}
        />
      )}
    </motion.label>
  );
};

const RangeSlider: React.FC<{
  range: RangeFilter;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}> = ({ range, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (newValue: [number, number]) => {
    setLocalValue(newValue);
    if (!isDragging) {
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onChange(localValue);
  };

  const percentage = (val: number) => 
    ((val - range.min) / (range.max - range.min)) * 100;

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>{range.min}{range.unit}</span>
        <span>{range.max}{range.unit}</span>
      </div>
      
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        {/* Track */}
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${percentage(localValue[0])}%`,
            width: `${percentage(localValue[1]) - percentage(localValue[0])}%`
          }}
        />
        
        {/* Min Handle */}
        <motion.div
          className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-lg -top-1.5"
          style={{ left: `${percentage(localValue[0])}%` }}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 1.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleMouseUp}
        />
        
        {/* Max Handle */}
        <motion.div
          className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-lg -top-1.5"
          style={{ left: `${percentage(localValue[1])}%` }}
          whileHover={{ scale: 1.1 }}
          whileDrag={{ scale: 1.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleMouseUp}
        />
      </div>
      
      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
        <span>{localValue[0]}{range.unit}</span>
        <span>{localValue[1]}{range.unit}</span>
      </div>
    </div>
  );
};

const FilterSection: React.FC<{
  section: FilterSection;
  selectedFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
}> = ({ section, selectedFilters, onFilterChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(section.isCollapsed || false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      {/* Section Header */}
      <button
        onClick={toggleCollapse}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {section.title}
        </h3>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      {/* Section Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              {section.type === 'checkbox' && section.options && (
                <div className="space-y-1">
                  {section.options.map((option) => (
                    <AnimatedCheckbox
                      key={option.id}
                      checked={selectedFilters[section.id]?.includes(option.id) || false}
                      onChange={(checked) => {
                        const current = selectedFilters[section.id] || [];
                        const newValue = checked
                          ? [...current, option.id]
                          : current.filter((id: string) => id !== option.id);
                        onFilterChange(section.id, newValue);
                      }}
                      label={option.label}
                      count={option.count}
                      color={option.color}
                    />
                  ))}
                </div>
              )}

              {section.type === 'range' && section.range && (
                <RangeSlider
                  range={section.range}
                  value={selectedFilters[section.id] || [section.range.min, section.range.max]}
                  onChange={(value) => onFilterChange(section.id, value)}
                />
              )}

              {section.type === 'tags' && section.options && (
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const isSelected = selectedFilters[section.id]?.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const current = selectedFilters[section.id] || [];
                          const newValue = isSelected
                            ? current.filter((id: string) => id !== option.id)
                            : [...current, option.id];
                          onFilterChange(section.id, newValue);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.label}
                        {option.count && (
                          <span className={`ml-1 text-xs ${
                            isSelected ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            ({option.count})
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  className = ''
}) => {
  const hasActiveFilters = Object.values(selectedFilters).some(
    value => Array.isArray(value) ? value.length > 0 : value !== undefined
  );

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Filters
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Refine your search results
          </p>
        </div>
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear All
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Sections */}
      <div>
        {filters.map((section) => (
          <FilterSection
            key={section.id}
            section={section}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SortOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(option => option.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          const currentIndex = options.findIndex(opt => opt.id === hoveredOption);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          setHoveredOption(options[nextIndex].id);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const currentIdx = options.findIndex(opt => opt.id === hoveredOption);
          const prevIndex = currentIdx > 0 ? currentIdx - 1 : options.length - 1;
          setHoveredOption(options[prevIndex].id);
          break;
        case 'Enter':
          e.preventDefault();
          if (hoveredOption) {
            onChange(hoveredOption);
            setIsOpen(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hoveredOption, options, onChange]);

  const handleOptionClick = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setHoveredOption(null);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHoveredOption(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        ref={buttonRef}
        onClick={toggleDropdown}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-800 
          border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm
          hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200
          focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
          ${isOpen ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900/30' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <span className="text-lg">{selectedOption.icon}</span>
          )}
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Sort by: {selectedOption?.label || 'Select option'}
            </div>
            {selectedOption?.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedOption.description}
              </div>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="py-2">
              {options.map((option, index) => {
                const isSelected = option.id === value;
                const isHovered = option.id === hoveredOption;
                
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleOptionClick(option.id)}
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150
                      ${isHovered || isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {/* Icon */}
                    {option.icon && (
                      <span className="text-lg flex-shrink-0">{option.icon}</span>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        isSelected 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className={`text-xs ${
                          isSelected 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {option.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Selection Indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="flex-shrink-0"
                        >
                          <CheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Hover Indicator */}
                    <AnimatePresence>
                      {isHovered && !isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Dropdown Footer */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Use ↑↓ arrows to navigate, Enter to select, Esc to close
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  estimatedItemHeight?: number;
  variableHeight?: boolean;
  getItemHeight?: (index: number) => number;
  scrollToIndex?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  height: number;
}

function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  estimatedItemHeight,
  variableHeight = false,
  getItemHeight,
  scrollToIndex,
  onEndReached,
  endReachedThreshold = 0.8,
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Cache for item heights when using variable heights
  const itemHeightCache = useRef<Map<number, number>>(new Map());
  const itemOffsetCache = useRef<Map<number, number>>(new Map());

  // Get item height (supports both fixed and variable heights)
  const getItemHeightMemo = useCallback((index: number): number => {
    if (variableHeight && getItemHeight) {
      const cached = itemHeightCache.current.get(index);
      if (cached !== undefined) return cached;
      
      const height = getItemHeight(index);
      itemHeightCache.current.set(index, height);
      return height;
    }
    return estimatedItemHeight || itemHeight;
  }, [variableHeight, getItemHeight, estimatedItemHeight, itemHeight]);

  // Calculate item offset
  const getItemOffset = useCallback((index: number): number => {
    if (!variableHeight) {
      return index * itemHeight;
    }

    const cached = itemOffsetCache.current.get(index);
    if (cached !== undefined) return cached;

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeightMemo(i);
    }
    
    itemOffsetCache.current.set(index, offset);
    return offset;
  }, [variableHeight, itemHeight, getItemHeightMemo]);

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (!variableHeight) {
      return items.length * itemHeight;
    }
    
    return items.reduce((total, _, index) => total + getItemHeightMemo(index), 0);
  }, [items.length, variableHeight, itemHeight, getItemHeightMemo]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!variableHeight) {
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight)
      );
      return { start: Math.max(0, start - overscan), end: Math.min(items.length - 1, end + overscan) };
    }

    // Binary search for variable heights
    let start = 0;
    let end = items.length - 1;
    
    // Find start index
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      const offset = getItemOffset(mid);
      
      if (offset < scrollTop) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }

    // Find end index
    let endIndex = start;
    let currentOffset = getItemOffset(start);
    
    while (endIndex < items.length && currentOffset < scrollTop + containerHeight) {
      currentOffset += getItemHeightMemo(endIndex);
      endIndex++;
    }

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan, variableHeight, getItemOffset, getItemHeightMemo]);

  // Generate virtual items
  const virtualItems: VirtualItem[] = useMemo(() => {
    const items: VirtualItem[] = [];
    
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      const start = getItemOffset(i);
      const height = getItemHeightMemo(i);
      
      items.push({
        index: i,
        start,
        end: start + height,
        height,
      });
    }
    
    return items;
  }, [visibleRange, getItemOffset, getItemHeightMemo]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    setIsScrolling(true);
    onScroll?.(scrollTop);

    // Check if end reached
    if (onEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage >= endReachedThreshold) {
        onEndReached();
      }
    }

    // Clear scrolling state after scroll ends
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [onScroll, onEndReached, endReachedThreshold]);

  // Scroll to specific index
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollElementRef.current) {
      const offset = getItemOffset(scrollToIndex);
      scrollElementRef.current.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }, [scrollToIndex, getItemOffset]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          {virtualItems.map((virtualItem) => (
            <motion.div
              key={virtualItem.index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: isScrolling ? 0.1 : 0.3,
                ease: "easeOut",
                layout: { duration: 0.2 }
              }}
              style={{
                position: 'absolute',
                top: virtualItem.start,
                height: virtualItem.height,
                width: '100%',
              }}
            >
              {renderItem(
                items[virtualItem.index],
                virtualItem.index,
                true
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scroll indicator */}
        {isScrolling && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium z-50"
          >
            {Math.round((scrollTop / (totalHeight - containerHeight)) * 100)}%
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default VirtualScrollList;

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
  initialIsIntersecting?: boolean;
}

interface IntersectionObserverEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: DOMRect;
  intersectionRect: DOMRect;
  rootBounds: DOMRect | null;
  target: Element;
  time: number;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    initialIsIntersecting = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const updateEntry = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setEntry(entry);
    setIsIntersecting(entry.isIntersecting);

    if (freezeOnceVisible && entry.isIntersecting && observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [freezeOnceVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create observer
    observerRef.current = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, updateEntry]);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
}

// Hook for multiple elements
export function useIntersectionObserverMultiple<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map());
  const elementsRef = useRef<Set<T>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const updateEntries = useCallback((observerEntries: IntersectionObserverEntry[]) => {
    setEntries(prev => {
      const newEntries = new Map(prev);
      
      observerEntries.forEach(entry => {
        newEntries.set(entry.target, entry);
        
        if (freezeOnceVisible && entry.isIntersecting && observerRef.current) {
          observerRef.current.unobserve(entry.target);
        }
      });
      
      return newEntries;
    });
  }, [freezeOnceVisible]);

  const observe = useCallback((element: T) => {
    if (!element || elementsRef.current.has(element)) return;

    elementsRef.current.add(element);

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(updateEntries, {
        threshold,
        root,
        rootMargin,
      });
    }

    observerRef.current.observe(element);
  }, [threshold, root, rootMargin, updateEntries]);

  const unobserve = useCallback((element: T) => {
    if (!element || !elementsRef.current.has(element)) return;

    elementsRef.current.delete(element);
    
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }

    setEntries(prev => {
      const newEntries = new Map(prev);
      newEntries.delete(element);
      return newEntries;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    observe,
    unobserve,
    entries,
  };
}

// Scroll-triggered animation component
export function useScrollAnimation(
  animationConfig: {
    threshold?: number;
    rootMargin?: string;
    animateOnce?: boolean;
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    animateOnce = true,
  } = animationConfig;

  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: animateOnce,
  });

  const animationProps = {
    initial: { opacity: 0, y: 50 },
    animate: isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  };

  return {
    ref,
    isIntersecting,
    animationProps,
  };
}

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  cacheHitRate: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showDetails?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  showDetails = false,
  onMetricsUpdate,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    bundleSize: 0,
    cacheHitRate: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(enabled);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(0);
  const cacheHitsRef = useRef(0);
  const cacheMissesRef = useRef(0);

  // FPS calculation
  useEffect(() => {
    if (!enabled) return;

    let animationId: number;

    const calculateFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        
        setMetrics(prev => ({ ...prev, fps }));
        
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationId = requestAnimationFrame(calculateFPS);
    };

    animationId = requestAnimationFrame(calculateFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  // Memory usage monitoring
  useEffect(() => {
    if (!enabled || !('memory' in performance)) return;

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 2000);
    updateMemoryUsage();

    return () => clearInterval(interval);
  }, [enabled]);

  // Load time measurement
  useEffect(() => {
    if (!enabled) return;

    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = Math.round(navigation.loadEventEnd - navigation.navigationStart);
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
      return () => window.removeEventListener('load', measureLoadTime);
    }
  }, [enabled]);

  // Render time measurement
  useEffect(() => {
    if (!enabled) return;

    renderStartRef.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime) }));
    };
  });

  // Bundle size estimation
  useEffect(() => {
    if (!enabled) return;

    const estimateBundleSize = () => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      let totalSize = 0;
      
      // This is an estimation - in production, you'd want to get actual sizes
      scripts.forEach(script => {
        const src = (script as HTMLScriptElement).src;
        if (src.includes('chunk') || src.includes('bundle')) {
          totalSize += 100; // Estimated KB per chunk
        }
      });
      
      styles.forEach(() => {
        totalSize += 20; // Estimated KB per stylesheet
      });

      setMetrics(prev => ({ ...prev, bundleSize: totalSize }));
    };

    estimateBundleSize();
  }, [enabled]);

  // Cache monitoring (simplified)
  useEffect(() => {
    if (!enabled) return;

    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (response.ok) {
          if (response.headers.get('cache-control') || response.headers.get('etag')) {
            cacheHitsRef.current++;
          } else {
            cacheMissesRef.current++;
          }
          
          const total = cacheHitsRef.current + cacheMissesRef.current;
          const hitRate = total > 0 ? Math.round((cacheHitsRef.current / total) * 100) : 0;
          
          setMetrics(prev => ({ ...prev, cacheHitRate: hitRate }));
        }
        
        return response;
      } catch (error) {
        cacheMissesRef.current++;
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [enabled]);

  // Update callback
  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  // Performance warnings
  const getPerformanceWarnings = () => {
    const warnings: string[] = [];
    
    if (metrics.fps < 30) warnings.push('Low FPS detected');
    if (metrics.memoryUsage > 100) warnings.push('High memory usage');
    if (metrics.loadTime > 3000) warnings.push('Slow page load');
    if (metrics.renderTime > 16) warnings.push('Slow render time');
    if (metrics.cacheHitRate < 50) warnings.push('Poor cache performance');
    
    return warnings;
  };

  const warnings = getPerformanceWarnings();
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed ${positionClasses[position]} z-50 font-mono text-xs`}
    >
      <motion.div
        className="bg-black/80 backdrop-blur-sm text-green-400 rounded-lg border border-green-500/30 shadow-lg"
        animate={{ width: isExpanded ? 'auto' : '120px' }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${metrics.fps > 30 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span>Perf</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.div>
        </div>

        {/* Compact view */}
        {!isExpanded && (
          <div className="px-2 pb-2 space-y-1">
            <div>FPS: {metrics.fps}</div>
            <div>MEM: {metrics.memoryUsage}MB</div>
          </div>
        )}

        {/* Expanded view */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-2 space-y-2 min-w-[200px]">
                {/* Metrics */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>FPS:</span>
                    <span className={metrics.fps > 30 ? 'text-green-400' : 'text-red-400'}>
                      {metrics.fps}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className={metrics.memoryUsage > 100 ? 'text-yellow-400' : 'text-green-400'}>
                      {metrics.memoryUsage}MB
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Load:</span>
                    <span className={metrics.loadTime > 3000 ? 'text-red-400' : 'text-green-400'}>
                      {metrics.loadTime}ms
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Render:</span>
                    <span className={metrics.renderTime > 16 ? 'text-yellow-400' : 'text-green-400'}>
                      {metrics.renderTime}ms
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Bundle:</span>
                    <span>{metrics.bundleSize}KB</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Cache:</span>
                    <span className={metrics.cacheHitRate > 70 ? 'text-green-400' : 'text-yellow-400'}>
                      {metrics.cacheHitRate}%
                    </span>
                  </div>
                </div>

                {/* Warnings */}
                {warnings.length > 0 && (
                  <div className="border-t border-red-500/30 pt-2">
                    <div className="text-red-400 font-semibold mb-1">Warnings:</div>
                    {warnings.map((warning, index) => (
                      <div key={index} className="text-red-300 text-xs">
                        ⚠ {warning}
                      </div>
                    ))}
                  </div>
                )}

                {/* Controls */}
                <div className="border-t border-green-500/30 pt-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVisible(false);
                    }}
                    className="text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                  >
                    Hide
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Performance Metrics:', metrics);
                    }}
                    className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors"
                  >
                    Log
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceMonitor;

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import LazyImage from '../components/Performance/LazyImage';
import VirtualScrollList from '../components/Performance/VirtualScrollList';
import { ProgressiveLoader, CardSkeleton, StaggeredSkeletonList } from '../components/Performance/SkeletonLoader';
import PerformanceMonitor from '../components/Performance/PerformanceMonitor';
import { useIntersectionObserver, useScrollAnimation } from '../hooks/useIntersectionObserver';
import { useDataProcessor } from '../hooks/useWebWorker';
import { useServiceWorker, useOfflineStatus } from '../hooks/useServiceWorker';

// Generate sample data for demos
const generateSampleData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
    description: `This is a sample description for item ${index + 1}. It contains some text to demonstrate the virtual scrolling capabilities.`,
    value: Math.floor(Math.random() * 1000),
    category: ['Tech', 'Design', 'Business', 'Science'][Math.floor(Math.random() * 4)],
    image: `https://picsum.photos/300/200?random=${index}`,
  }));
};

const PerformanceDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [virtualListData] = useState(() => generateSampleData(10000));
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  // Hooks
  const { isOnline } = useOfflineStatus();
  const serviceWorker = useServiceWorker();
  const dataProcessor = useDataProcessor();
  const { ref: scrollRef, isIntersecting, animationProps } = useScrollAnimation();

  // Sample images for lazy loading demo
  const sampleImages = useMemo(() => [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600',
  ], []);

  // Demo functions
  const handleProcessData = async () => {
    setIsLoading(true);
    try {
      const result = await dataProcessor.sortData(
        virtualListData.slice(0, 1000),
        { key: 'value', direction: 'desc' }
      );
      setProcessedData(result.slice(0, 10));
    } catch (error) {
      console.error('Data processing failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkeletons = () => {
    setShowSkeletons(true);
    setTimeout(() => setShowSkeletons(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Performance Monitor */}
      <PerformanceMonitor enabled={true} position="top-right" />

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🚀 Performance Demo
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            High-performance frontend components optimized for speed and user experience
          </p>
          
          {/* Status indicators */}
          <div className="flex justify-center gap-4 mb-8">
            <div className={`px-3 py-1 rounded-full text-sm ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${serviceWorker.isRegistered ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {serviceWorker.isRegistered ? '⚡ SW Active' : '⚪ SW Inactive'}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${dataProcessor.isLoading ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
              {dataProcessor.isLoading ? '⏳ Processing' : '✅ Ready'}
            </div>
          </div>
        </motion.div>

        {/* Demo Sections */}
        <div className="space-y-16">
          
          {/* 1. Lazy Loading Images */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              🖼️ Lazy Loading Images
              <span className="text-sm font-normal text-gray-400">Blur-to-sharp transitions</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleImages.map((src, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <LazyImage
                    src={src}
                    alt={`Demo image ${index + 1}`}
                    className="w-full h-full"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Images load progressively with blur placeholders and smooth transitions. First image has priority loading.
            </p>
          </section>

          {/* 2. Virtual Scrolling */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📜 Virtual Scrolling
              <span className="text-sm font-normal text-gray-400">10,000 items rendered efficiently</span>
            </h2>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <VirtualScrollList
                items={virtualListData}
                itemHeight={80}
                containerHeight={400}
                className="border border-gray-700 rounded"
                renderItem={(item, index, isVisible) => (
                  <div className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                      {item.id + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">{item.value}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </div>
                  </div>
                )}
              />
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Only visible items are rendered in the DOM. Smooth scrolling with momentum and scroll indicators.
            </p>
          </section>

          {/* 3. Intersection Observer Animations */}
          <motion.section 
            ref={scrollRef}
            {...animationProps}
            className="card p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              👁️ Scroll Animations
              <span className="text-sm font-normal text-gray-400">Intersection Observer powered</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item, index) => (
                <ScrollAnimatedCard key={item} index={index} />
              ))}
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Elements animate into view when scrolled into viewport. Performance optimized with Intersection Observer API.
            </p>
          </motion.section>

          {/* 4. Web Workers */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              ⚙️ Web Workers
              <span className="text-sm font-normal text-gray-400">Heavy computations without blocking UI</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleProcessData}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Sort 1000 Items'}
                </button>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Workers: {dataProcessor.activeWorkers}/{dataProcessor.totalWorkers}</span>
                  <span>•</span>
                  <span>Pending: {dataProcessor.pendingTasks}</span>
                </div>
              </div>
              
              {processedData.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Top 10 Results:</h3>
                  <div className="space-y-2">
                    {processedData.map((item, index) => (
                      <div key={item.id} className="flex justify-between items-center py-1">
                        <span>{item.name}</span>
                        <span className="font-bold text-green-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Heavy data processing runs in background threads without freezing the UI. Multiple workers for parallel processing.
            </p>
          </section>

          {/* 5. Progressive Loading & Skeletons */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              💀 Skeleton Screens
              <span className="text-sm font-normal text-gray-400">Progressive loading states</span>
            </h2>
            
            <div className="space-y-6">
              <button
                onClick={toggleSkeletons}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Demo Loading States
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProgressiveLoader
                  isLoading={showSkeletons}
                  skeleton={<CardSkeleton />}
                >
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full" />
                      <div>
                        <h3 className="font-semibold">John Doe</h3>
                        <p className="text-gray-400 text-sm">Software Engineer</p>
                      </div>
                    </div>
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded mb-4" />
                    <p className="text-gray-300">
                      This is a sample card that demonstrates the progressive loading with skeleton screens.
                      The skeleton provides visual feedback while content loads.
                    </p>
                  </div>
                </ProgressiveLoader>
                
                <ProgressiveLoader
                  isLoading={showSkeletons}
                  skeleton={<StaggeredSkeletonList count={3} skeleton={CardSkeleton} />}
                >
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-3 border border-gray-700 rounded-lg">
                        <h4 className="font-semibold">Loaded Item {item}</h4>
                        <p className="text-gray-400 text-sm">Content loaded successfully</p>
                      </div>
                    ))}
                  </div>
                </ProgressiveLoader>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              Skeleton screens provide immediate visual feedback and improve perceived performance during loading states.
            </p>
          </section>

          {/* 6. Bundle Optimization Info */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              📦 Bundle Optimization
              <span className="text-sm font-normal text-gray-400">Code splitting & lazy loading</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-400">✅ Optimizations Applied</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Manual chunk splitting by vendor</li>
                  <li>• Feature-based code splitting</li>
                  <li>• Tree shaking enabled</li>
                  <li>• CSS code splitting</li>
                  <li>• Asset optimization</li>
                  <li>• Gzip compression</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-blue-400">⚡ Performance Features</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Service Worker caching</li>
                  <li>• Image lazy loading</li>
                  <li>• Virtual scrolling</li>
                  <li>• Web Workers for heavy tasks</li>
                  <li>• GPU-accelerated animations</li>
                  <li>• Memory-efficient rendering</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Helper component for scroll animations
const ScrollAnimatedCard: React.FC<{ index: number }> = ({ index }) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-lg"
    >
      <div className="text-2xl mb-2">🎯</div>
      <h3 className="font-semibold mb-2">Animated Card {index + 1}</h3>
      <p className="text-blue-100 text-sm">
        This card animates into view when scrolled into the viewport using Intersection Observer.
      </p>
    </motion.div>
  );
};

export default PerformanceDemo;

import { useRef, useCallback, useEffect, useState } from 'react';

interface WebWorkerTask {
  id: string;
  type: string;
  data: any;
  options?: any;
}

interface WebWorkerResult {
  id: string;
  result: any;
  error?: string;
  duration: number;
}

interface WebWorkerProgress {
  id: string;
  progress: number;
  message?: string;
}

interface UseWebWorkerOptions {
  workerPath: string;
  maxWorkers?: number;
  terminateOnUnmount?: boolean;
}

interface WorkerInstance {
  worker: Worker;
  busy: boolean;
  taskId?: string;
}

export function useWebWorker(options: UseWebWorkerOptions) {
  const { workerPath, maxWorkers = 1, terminateOnUnmount = true } = options;
  
  const workersRef = useRef<WorkerInstance[]>([]);
  const pendingTasksRef = useRef<WebWorkerTask[]>([]);
  const taskCallbacksRef = useRef<Map<string, {
    resolve: (result: any) => void;
    reject: (error: Error) => void;
    onProgress?: (progress: WebWorkerProgress) => void;
  }>>(new Map());
  
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<Map<string, WebWorkerProgress>>(new Map());

  // Initialize workers
  const initializeWorkers = useCallback(() => {
    for (let i = 0; i < maxWorkers; i++) {
      try {
        const worker = new Worker(new URL(workerPath, import.meta.url), {
          type: 'module'
        });
        
        worker.onmessage = (e) => {
          const message = e.data;
          
          if (message.type === 'progress') {
            const progressData: WebWorkerProgress = {
              id: message.id,
              progress: message.progress,
              message: message.message,
            };
            
            setProgress(prev => new Map(prev.set(message.id, progressData)));
            
            const callbacks = taskCallbacksRef.current.get(message.id);
            if (callbacks?.onProgress) {
              callbacks.onProgress(progressData);
            }
          } else {
            // Task completed
            const result: WebWorkerResult = message;
            const callbacks = taskCallbacksRef.current.get(result.id);
            
            if (callbacks) {
              if (result.error) {
                callbacks.reject(new Error(result.error));
              } else {
                callbacks.resolve(result.result);
              }
              
              taskCallbacksRef.current.delete(result.id);
              setProgress(prev => {
                const newProgress = new Map(prev);
                newProgress.delete(result.id);
                return newProgress;
              });
            }
            
            // Mark worker as available
            const workerInstance = workersRef.current.find(w => w.worker === worker);
            if (workerInstance) {
              workerInstance.busy = false;
              workerInstance.taskId = undefined;
            }
            
            // Process next pending task
            processNextTask();
          }
        };
        
        worker.onerror = (error) => {
          console.error('Worker error:', error);
          
          // Find and reject the current task
          const workerInstance = workersRef.current.find(w => w.worker === worker);
          if (workerInstance?.taskId) {
            const callbacks = taskCallbacksRef.current.get(workerInstance.taskId);
            if (callbacks) {
              callbacks.reject(new Error('Worker error'));
              taskCallbacksRef.current.delete(workerInstance.taskId);
            }
            
            workerInstance.busy = false;
            workerInstance.taskId = undefined;
          }
        };
        
        workersRef.current.push({
          worker,
          busy: false,
        });
      } catch (error) {
        console.error('Failed to create worker:', error);
      }
    }
  }, [workerPath, maxWorkers]);

  // Process next pending task
  const processNextTask = useCallback(() => {
    const nextTask = pendingTasksRef.current.shift();
    if (!nextTask) {
      setIsLoading(false);
      return;
    }
    
    const availableWorker = workersRef.current.find(w => !w.busy);
    if (!availableWorker) {
      // Put task back at the front of the queue
      pendingTasksRef.current.unshift(nextTask);
      return;
    }
    
    availableWorker.busy = true;
    availableWorker.taskId = nextTask.id;
    availableWorker.worker.postMessage(nextTask);
  }, []);

  // Execute task
  const executeTask = useCallback(<T = any>(
    type: string,
    data: any,
    options?: any,
    onProgress?: (progress: WebWorkerProgress) => void
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task: WebWorkerTask = {
        id: taskId,
        type,
        data,
        options,
      };
      
      taskCallbacksRef.current.set(taskId, {
        resolve,
        reject,
        onProgress,
      });
      
      pendingTasksRef.current.push(task);
      setIsLoading(true);
      
      // Try to process immediately if worker is available
      processNextTask();
    });
  }, [processNextTask]);

  // Terminate all workers
  const terminateWorkers = useCallback(() => {
    workersRef.current.forEach(({ worker }) => {
      worker.terminate();
    });
    workersRef.current = [];
    
    // Reject all pending tasks
    taskCallbacksRef.current.forEach(({ reject }) => {
      reject(new Error('Worker terminated'));
    });
    taskCallbacksRef.current.clear();
    pendingTasksRef.current = [];
    
    setIsLoading(false);
    setProgress(new Map());
  }, []);

  // Initialize workers on mount
  useEffect(() => {
    initializeWorkers();
    
    return () => {
      if (terminateOnUnmount) {
        terminateWorkers();
      }
    };
  }, [initializeWorkers, terminateWorkers, terminateOnUnmount]);

  return {
    executeTask,
    terminateWorkers,
    isLoading,
    progress,
    activeWorkers: workersRef.current.filter(w => w.busy).length,
    totalWorkers: workersRef.current.length,
    pendingTasks: pendingTasksRef.current.length,
  };
}

// Specialized hook for data processing
export function useDataProcessor() {
  const webWorker = useWebWorker({
    workerPath: '/src/utils/webWorkers/dataProcessor.worker.ts',
    maxWorkers: navigator.hardwareConcurrency || 4,
  });

  const sortData = useCallback((
    data: any[],
    options: { key?: string; direction?: 'asc' | 'desc' } = {},
    onProgress?: (progress: WebWorkerProgress) => void
  ) => {
    return webWorker.executeTask('sort', data, options, onProgress);
  }, [webWorker]);

  const filterData = useCallback((
    data: any[],
    predicate: string,
    params?: any,
    onProgress?: (progress: WebWorkerProgress) => void
  ) => {
    return webWorker.executeTask('filter', data, { predicate, params }, onProgress);
  }, [webWorker]);

  const searchData = useCallback((
    data: any[],
    query: string,
    options: { fields?: string[]; fuzzy?: boolean } = {},
    onProgress?: (progress: WebWorkerProgress) => void
  ) => {
    return webWorker.executeTask('search', data, { query, ...options }, onProgress);
  }, [webWorker]);

  const calculateData = useCallback((
    data: any[],
    operation: string,
    field?: string,
    onProgress?: (progress: WebWorkerProgress) => void
  ) => {
    return webWorker.executeTask('calculate', data, { operation, field }, onProgress);
  }, [webWorker]);

  const transformData = useCallback((
    data: any[],
    transformer: string,
    params?: any,
    onProgress?: (progress: WebWorkerProgress) => void
  ) => {
    return webWorker.executeTask('transform', data, { transformer, params }, onProgress);
  }, [webWorker]);

  return {
    ...webWorker,
    sortData,
    filterData,
    searchData,
    calculateData,
    transformData,
  };
}

// Web Worker for heavy data processing tasks

interface ProcessingTask {
  id: string;
  type: 'sort' | 'filter' | 'search' | 'calculate' | 'transform';
  data: any;
  options?: any;
}

interface ProcessingResult {
  id: string;
  result: any;
  error?: string;
  duration: number;
}

// Heavy computation functions
const heavyComputations = {
  // Sort large datasets
  sort: (data: any[], options: { key?: string; direction?: 'asc' | 'desc' } = {}) => {
    const { key, direction = 'asc' } = options;
    
    return data.sort((a, b) => {
      const valueA = key ? a[key] : a;
      const valueB = key ? b[key] : b;
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  },

  // Filter large datasets with complex conditions
  filter: (data: any[], options: { predicate: string; params?: any }) => {
    const { predicate, params = {} } = options;
    
    // Create function from string (be careful with eval in production)
    const filterFn = new Function('item', 'params', `return ${predicate}`);
    
    return data.filter(item => filterFn(item, params));
  },

  // Search through large datasets
  search: (data: any[], options: { query: string; fields?: string[]; fuzzy?: boolean }) => {
    const { query, fields, fuzzy = false } = options;
    const searchTerm = query.toLowerCase();
    
    return data.filter(item => {
      const searchFields = fields || Object.keys(item);
      
      return searchFields.some(field => {
        const value = String(item[field]).toLowerCase();
        
        if (fuzzy) {
          // Simple fuzzy search using Levenshtein distance
          return levenshteinDistance(value, searchTerm) <= 2;
        } else {
          return value.includes(searchTerm);
        }
      });
    });
  },

  // Complex calculations
  calculate: (data: any[], options: { operation: string; field?: string }) => {
    const { operation, field } = options;
    const values = field ? data.map(item => item[field]) : data;
    
    switch (operation) {
      case 'sum':
        return values.reduce((sum, val) => sum + (Number(val) || 0), 0);
      case 'average':
        return values.reduce((sum, val) => sum + (Number(val) || 0), 0) / values.length;
      case 'min':
        return Math.min(...values.map(v => Number(v) || 0));
      case 'max':
        return Math.max(...values.map(v => Number(v) || 0));
      case 'median':
        const sorted = values.map(v => Number(v) || 0).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  },

  // Transform data structures
  transform: (data: any[], options: { transformer: string; params?: any }) => {
    const { transformer, params = {} } = options;
    
    // Create transformer function from string
    const transformFn = new Function('item', 'index', 'params', `return ${transformer}`);
    
    return data.map((item, index) => transformFn(item, index, params));
  },
};

// Helper function for fuzzy search
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Progress reporting for long-running tasks
function reportProgress(id: string, progress: number, message?: string) {
  self.postMessage({
    type: 'progress',
    id,
    progress,
    message,
  });
}

// Main message handler
self.onmessage = function(e: MessageEvent<ProcessingTask>) {
  const { id, type, data, options } = e.data;
  const startTime = performance.now();
  
  try {
    reportProgress(id, 0, 'Starting processing...');
    
    let result: any;
    
    switch (type) {
      case 'sort':
        result = heavyComputations.sort(data, options);
        break;
      case 'filter':
        result = heavyComputations.filter(data, options);
        break;
      case 'search':
        result = heavyComputations.search(data, options);
        break;
      case 'calculate':
        result = heavyComputations.calculate(data, options);
        break;
      case 'transform':
        result = heavyComputations.transform(data, options);
        break;
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    
    const duration = performance.now() - startTime;
    reportProgress(id, 100, 'Processing complete');
    
    const response: ProcessingResult = {
      id,
      result,
      duration,
    };
    
    self.postMessage(response);
  } catch (error) {
    const duration = performance.now() - startTime;
    const response: ProcessingResult = {
      id,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    };
    
    self.postMessage(response);
  }
};

// Handle worker termination
self.onclose = function() {
  console.log('Data processor worker terminated');
};

export {}; // Make this a module

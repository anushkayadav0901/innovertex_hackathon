import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
  return uuidv4();
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const calculateTimeRemaining = (endTime: number): string => {
  const now = Date.now();
  const remaining = endTime - now;
  
  if (remaining <= 0) {
    return 'Ended';
  }
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const paginate = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

export const calculatePagination = (count: number, page: number, limit: number) => {
  return {
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count,
    itemsPerPage: limit,
    hasNext: page < Math.ceil(count / limit),
    hasPrev: page > 1,
  };
};

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import TagCloud from './TagCloud';
import SortDropdown from './SortDropdown';
import SearchResults from './SearchResults';
import EmptyState from './EmptyState';

// Types
interface SearchSuggestion {
  id: string;
  text: string;
  type: 'hackathon' | 'team' | 'category' | 'organizer';
  icon?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'team' | 'project' | 'organizer';
  image?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  matchedFields?: string[];
}

interface Tag {
  id: string;
  label: string;
  count: number;
  category?: string;
  color?: string;
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'tags';
  options?: Array<{
    id: string;
    label: string;
    count?: number;
    color?: string;
  }>;
  range?: {
    id: string;
    label: string;
    min: number;
    max: number;
    value: [number, number];
    unit?: string;
    step?: number;
  };
  isCollapsed?: boolean;
}

interface SortOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

// Sample data
const SAMPLE_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', text: 'InnovertEx 2024', type: 'hackathon', icon: '🏆' },
  { id: '2', text: 'Web3 Summit Hack', type: 'hackathon', icon: '🏆' },
  { id: '3', text: 'Green Tech Challenge', type: 'hackathon', icon: '🏆' },
  { id: '4', text: 'FinTech Revolution', type: 'hackathon', icon: '🏆' },
  { id: '5', text: 'HealthTech Hack', type: 'hackathon', icon: '🏆' },
  { id: '6', text: 'Game Dev Jam', type: 'hackathon', icon: '🏆' },
  { id: '7', text: 'IoT Connect', type: 'hackathon', icon: '🏆' },
  { id: '8', text: 'AI', type: 'category', icon: '🤖' },
  { id: '9', text: 'Machine Learning', type: 'category', icon: '🤖' },
  { id: '10', text: 'Blockchain', type: 'category', icon: '⛓️' },
  { id: '11', text: 'Code Crusaders', type: 'team', icon: '👥' },
  { id: '12', text: 'AI Pioneers', type: 'team', icon: '👥' },
  { id: '13', text: 'Blockchain Builders', type: 'team', icon: '👥' },
  { id: '14', text: 'TechCorp', type: 'organizer', icon: '🏢' },
  { id: '15', text: 'EcoInnovate', type: 'organizer', icon: '🏢' },
  { id: '16', text: 'FinanceHub', type: 'organizer', icon: '🏢' },
];

const SAMPLE_RESULTS: SearchResult[] = [
  // Hackathons
  {
    id: '1',
    title: 'InnovertEx 2024',
    description: 'Premier AI/ML hackathon focusing on innovation and cutting-edge technology solutions. Join 500+ participants for 48 hours of intense coding.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    tags: ['AI', 'Machine Learning', 'Innovation', 'Technology'],
    metadata: {
      'Prize Pool': '₹42,00,000',
      'Teams': '150+',
      'Duration': '48 hours',
      'Organizer': 'TechCorp'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  {
    id: '2',
    title: 'Web3 Summit Hack',
    description: 'Decentralized future building hackathon focusing on blockchain technology and Web3 innovations.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    tags: ['Blockchain', 'Web3', 'Crypto', 'DeFi'],
    metadata: {
      'Prize Pool': '₹25,20,000',
      'Teams': '100+',
      'Duration': '36 hours',
      'Organizer': 'TechCorp'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  {
    id: '3',
    title: 'Green Tech Challenge',
    description: 'Building solutions for environmental challenges and sustainability. Focus on climate change and green technology.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    tags: ['Sustainability', 'Environment', 'Green Tech', 'Climate'],
    metadata: {
      'Prize Pool': '₹21,00,000',
      'Teams': '80+',
      'Duration': '48 hours',
      'Organizer': 'EcoInnovate'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  {
    id: '4',
    title: 'FinTech Revolution',
    description: 'Revolutionizing financial services with innovative fintech solutions. Build the future of banking and payments.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    tags: ['FinTech', 'Banking', 'Payments', 'Finance'],
    metadata: {
      'Prize Pool': '₹33,60,000',
      'Teams': '120+',
      'Duration': '48 hours',
      'Organizer': 'FinanceHub'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  {
    id: '5',
    title: 'HealthTech Hack',
    description: 'Healthcare innovation for better lives. Build solutions for medical challenges and health technology.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    tags: ['HealthTech', 'Medical', 'Healthcare', 'Innovation'],
    metadata: {
      'Prize Pool': '₹29,40,000',
      'Teams': '90+',
      'Duration': '48 hours',
      'Organizer': 'MedTech Solutions'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  {
    id: '6',
    title: 'Game Dev Jam',
    description: 'Create the next gaming sensation! Build innovative games and interactive experiences.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    tags: ['Gaming', 'Game Development', 'Unity', 'Entertainment'],
    metadata: {
      'Prize Pool': '₹16,80,000',
      'Teams': '70+',
      'Duration': '72 hours',
      'Organizer': 'GameStudio'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  {
    id: '7',
    title: 'IoT Connect',
    description: 'Connecting the world through IoT. Build smart devices and connected solutions for the future.',
    type: 'hackathon',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    tags: ['IoT', 'Smart Devices', 'Connected', 'Technology'],
    metadata: {
      'Prize Pool': '₹23,52,000',
      'Teams': '85+',
      'Duration': '48 hours',
      'Organizer': 'TechCorp'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  // Teams
  {
    id: '8',
    title: 'Code Crusaders',
    description: 'Elite team of developers specializing in full-stack web applications and mobile development. Winners of 3 hackathons.',
    type: 'team',
    tags: ['React', 'Node.js', 'Mobile', 'Full-Stack'],
    metadata: {
      'Members': '4',
      'Wins': '3',
      'Experience': '5+ years'
    },
    matchedFields: ['title', 'tags']
  },
  {
    id: '9',
    title: 'AI Pioneers',
    description: 'Cutting-edge AI team focused on machine learning and artificial intelligence solutions.',
    type: 'team',
    tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
    metadata: {
      'Members': '5',
      'Wins': '2',
      'Experience': '4+ years'
    },
    matchedFields: ['title', 'tags', 'description']
  },
  {
    id: '10',
    title: 'Blockchain Builders',
    description: 'Specialized blockchain development team creating decentralized applications and smart contracts.',
    type: 'team',
    tags: ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts'],
    metadata: {
      'Members': '3',
      'Wins': '4',
      'Experience': '6+ years'
    },
    matchedFields: ['title', 'tags', 'description']
  },
  // Projects
  {
    id: '11',
    title: 'Smart City Solutions',
    description: 'Revolutionary IoT project for smart city management, featuring real-time monitoring and AI-powered analytics.',
    type: 'project',
    tags: ['IoT', 'Smart City', 'Analytics', 'Sensors'],
    metadata: {
      'Status': 'In Development',
      'Team Size': '6',
      'Tech Stack': 'IoT, Python, React'
    },
    matchedFields: ['description', 'tags']
  },
  {
    id: '12',
    title: 'EcoTracker App',
    description: 'Mobile application for tracking carbon footprint and promoting sustainable living practices.',
    type: 'project',
    tags: ['Sustainability', 'Mobile App', 'Environment', 'React Native'],
    metadata: {
      'Status': 'Completed',
      'Team Size': '4',
      'Tech Stack': 'React Native, Node.js'
    },
    matchedFields: ['title', 'description', 'tags']
  },
  // Organizers
  {
    id: '13',
    title: 'TechCorp',
    description: 'Leading technology company organizing multiple hackathons focused on AI, blockchain, and IoT innovations.',
    type: 'organizer',
    tags: ['AI', 'Blockchain', 'IoT', 'Innovation'],
    metadata: {
      'Events Organized': '15+',
      'Total Prize Pool': '₹4,20,00,000+',
      'Participants': '5000+'
    },
    matchedFields: ['title', 'description']
  },
  {
    id: '14',
    title: 'EcoInnovate',
    description: 'Environmental technology organization promoting green innovation and sustainable development solutions.',
    type: 'organizer',
    tags: ['Environment', 'Sustainability', 'Green Tech', 'Climate'],
    metadata: {
      'Events Organized': '8+',
      'Focus': 'Environmental Solutions',
      'Impact': 'Global'
    },
    matchedFields: ['title', 'description']
  }
];

const SAMPLE_TAGS: Tag[] = [
  { id: '1', label: 'AI', count: 45, color: 'blue' },
  { id: '2', label: 'Machine Learning', count: 38, color: 'purple' },
  { id: '3', label: 'Web Development', count: 52, color: 'green' },
  { id: '4', label: 'Mobile', count: 29, color: 'orange' },
  { id: '5', label: 'Blockchain', count: 21, color: 'indigo' },
  { id: '6', label: 'IoT', count: 18, color: 'red' },
  { id: '7', label: 'Data Science', count: 34, color: 'yellow' },
  { id: '8', label: 'Cybersecurity', count: 16, color: 'pink' },
];

const FILTER_SECTIONS: FilterSection[] = [
  {
    id: 'type',
    title: 'Content Type',
    type: 'checkbox',
    options: [
      { id: 'hackathon', label: 'Hackathons', count: 25, color: '#3b82f6' },
      { id: 'team', label: 'Teams', count: 18, color: '#10b981' },
      { id: 'project', label: 'Projects', count: 32, color: '#8b5cf6' },
      { id: 'organizer', label: 'Organizers', count: 12, color: '#f59e0b' },
    ]
  },
  {
    id: 'category',
    title: 'Categories',
    type: 'tags',
    options: [
      { id: 'ai', label: 'AI/ML', count: 45 },
      { id: 'web', label: 'Web Dev', count: 52 },
      { id: 'mobile', label: 'Mobile', count: 29 },
      { id: 'blockchain', label: 'Blockchain', count: 21 },
      { id: 'iot', label: 'IoT', count: 18 },
      { id: 'data', label: 'Data Science', count: 34 },
    ]
  },
  {
    id: 'prizeRange',
    title: 'Prize Range',
    type: 'range',
    range: {
      id: 'prize',
      label: 'Prize Pool',
      min: 0,
      max: 5000000,
      value: [0, 5000000],
      unit: '₹',
      step: 100000
    }
  },
  {
    id: 'teamSize',
    title: 'Team Size',
    type: 'range',
    range: {
      id: 'size',
      label: 'Number of Members',
      min: 1,
      max: 10,
      value: [1, 10],
      unit: '',
      step: 1
    }
  }
];

const SORT_OPTIONS: SortOption[] = [
  { id: 'relevance', label: 'Relevance', icon: '🎯', description: 'Best match for your search' },
  { id: 'date', label: 'Date', icon: '📅', description: 'Most recent first' },
  { id: 'popularity', label: 'Popularity', icon: '⭐', description: 'Most popular items' },
  { id: 'prize', label: 'Prize Pool', icon: '💰', description: 'Highest prizes first' },
  { id: 'alphabetical', label: 'A-Z', icon: '🔤', description: 'Alphabetical order' },
];

interface SearchInterfaceProps {
  className?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ className = '' }) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Simulated search results
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Simulate search with loading
  const performSearch = async (query: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (query.trim()) {
      // Filter results based on query
      const filtered = SAMPLE_RESULTS.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        result.metadata && Object.values(result.metadata).some(value => 
          value.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearchResults(filtered);
      setTotalCount(filtered.length);
    } else {
      // Show all results when no query (for browsing)
      setSearchResults(SAMPLE_RESULTS);
      setTotalCount(SAMPLE_RESULTS.length);
    }
    
    setIsLoading(false);
    setCurrentPage(1);
  };

  // Initialize with all results on component mount and handle URL query
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('q');
    
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
      performSearch(queryFromUrl);
    } else {
      setSearchResults(SAMPLE_RESULTS);
      setTotalCount(SAMPLE_RESULTS.length);
    }
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Handle tag selection
  const handleTagClick = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSelectedFilters({});
    setSelectedTags([]);
    setSortBy('relevance');
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    console.log('Result clicked:', result);
    // Navigate to result detail page
  };

  // Get filtered suggestions based on current query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return SAMPLE_SUGGESTIONS.filter(suggestion =>
      suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  // Determine empty state type
  const getEmptyStateType = () => {
    if (searchResults.length === 0 && !isLoading && searchQuery.trim()) return 'no-results';
    return 'no-search';
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
            Discover Amazing Innovations
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Search through hackathons, teams, projects, and organizers to find exactly what you're looking for
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-6 sm:mb-8 px-2"
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            suggestions={filteredSuggestions}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <span className="sm:hidden">Filters</span>
            </button>
            
            {totalCount > 0 && (
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {totalCount} result{totalCount !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          <SortDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            className="w-full sm:w-64"
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-80 lg:flex-shrink-0 space-y-4 lg:space-y-6"
              >
                {/* Filters */}
                <FilterSidebar
                  filters={FILTER_SECTIONS}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                />

                {/* Tag Cloud */}
                <TagCloud
                  tags={SAMPLE_TAGS}
                  selectedTags={selectedTags}
                  onTagClick={handleTagClick}
                  maxTags={20}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <SearchResults
              results={searchResults}
              query={searchQuery}
              isLoading={isLoading}
              totalCount={totalCount}
              currentPage={currentPage}
              itemsPerPage={10}
              onResultClick={handleResultClick}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;

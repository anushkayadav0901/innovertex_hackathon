import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
import ProjectCard from './ProjectCard'
import FilterTabs from './FilterTabs'
import ZoomModal from './ZoomModal'
import SkeletonCard from './SkeletonCard'

export interface Project {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  images: string[]
  demoUrl?: string
  githubUrl?: string
  technologies: string[]
  teamSize: number
  prize?: string
  featured?: boolean
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Assistant',
    description: 'Revolutionary healthcare chatbot using machine learning to provide instant medical advice and symptom analysis.',
    category: 'AI/ML',
    tags: ['Healthcare', 'Machine Learning', 'Chatbot'],
    images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400'],
    technologies: ['Python', 'TensorFlow', 'React', 'Node.js'],
    teamSize: 4,
    prize: '1st Place',
    featured: true
  },
  {
    id: '2',
    title: 'Smart City Traffic Optimizer',
    description: 'IoT-based traffic management system that reduces congestion using real-time data analytics.',
    category: 'IoT',
    tags: ['Smart City', 'Traffic', 'Analytics'],
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'],
    technologies: ['Arduino', 'Python', 'MongoDB', 'React'],
    teamSize: 3,
    featured: false
  },
  {
    id: '3',
    title: 'Blockchain Voting Platform',
    description: 'Secure and transparent voting system built on blockchain technology ensuring election integrity.',
    category: 'Blockchain',
    tags: ['Voting', 'Security', 'Democracy'],
    images: ['https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=400', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400'],
    technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
    teamSize: 5,
    prize: '2nd Place'
  },
  {
    id: '4',
    title: 'AR Learning Experience',
    description: 'Immersive augmented reality application for interactive learning in STEM subjects.',
    category: 'AR/VR',
    tags: ['Education', 'AR', 'STEM'],
    images: ['https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400'],
    technologies: ['Unity', 'C#', 'ARCore', 'Blender'],
    teamSize: 4
  },
  {
    id: '5',
    title: 'Sustainable Energy Monitor',
    description: 'Real-time energy consumption tracking with AI-powered optimization suggestions.',
    category: 'Sustainability',
    tags: ['Energy', 'Sustainability', 'Monitoring'],
    images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400'],
    technologies: ['React Native', 'Firebase', 'Python', 'TensorFlow'],
    teamSize: 3,
    prize: '3rd Place'
  },
  {
    id: '6',
    title: 'Mental Health Companion',
    description: 'AI-driven mental health support app with mood tracking and personalized recommendations.',
    category: 'Healthcare',
    tags: ['Mental Health', 'AI', 'Wellness'],
    images: ['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400'],
    technologies: ['Flutter', 'Firebase', 'Python', 'NLP'],
    teamSize: 4,
    featured: true
  }
]

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const categories = ['All', 'AI/ML', 'IoT', 'Blockchain', 'AR/VR', 'Healthcare', 'Sustainability']

  // Simulate loading projects
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      setProjects(mockProjects)
      setLoading(false)
    }
    loadProjects()
  }, [])

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesCategory && matchesSearch
    })
  }, [projects, activeCategory, searchTerm])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
        return
      }
      
      if (hasMore && page < 3) { // Simulate pagination
        setPage(prev => prev + 1)
        // In real app, load more projects here
      } else {
        setHasMore(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore, page])

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text
    
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="search-highlight">{part}</span>
      ) : part
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-brand-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Project Showcase
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover amazing projects built by talented developers in hackathons around the world
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, technologies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 pr-4 w-full"
            />
          </div>

          {/* Filter Tabs and View Toggle */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <FilterTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="masonry-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="projects"
              className={viewMode === 'grid' ? 'masonry-grid' : 'space-y-4'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    ...project,
                    title: highlightText(project.title, searchTerm) as any,
                    description: highlightText(project.description, searchTerm) as any
                  }}
                  index={index}
                  viewMode={viewMode}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Loading More */}
        {!loading && hasMore && filteredProjects.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-brand-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <ZoomModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}

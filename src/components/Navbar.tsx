import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Rocket, LogIn, UserPlus, Sun, Moon, Search, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useTheme } from '@/components/theme/ThemeProvider'
import NotificationBell from '@/components/community/NotificationBell'

export default function Navbar() {
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const logout = useStore(s => s.logout)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample search suggestions
  const searchSuggestions = [
    { id: '1', text: 'InnovertEx 2024', type: 'hackathon', icon: '🏆' },
    { id: '2', text: 'AI Hackathon', type: 'hackathon', icon: '🏆' },
    { id: '3', text: 'Web3 Summit', type: 'hackathon', icon: '🏆' },
    { id: '4', text: 'Code Crusaders', type: 'team', icon: '👥' },
    { id: '5', text: 'AI', type: 'category', icon: '🤖' },
    { id: '6', text: 'Blockchain', type: 'category', icon: '⛓️' },
  ]

  // Filter suggestions based on query
  const filteredSuggestions = searchQuery.trim() 
    ? searchSuggestions.filter(s => 
        s.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : searchSuggestions.slice(0, 5)

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle search submission
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const { isBeginnerMode } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Rocket className="h-6 w-6 text-brand-400" />
          <span>Innovortex</span>
        </Link>
        <nav className="hidden gap-4 md:flex items-center transition-all duration-300">
          <NavLink to="/discover" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Find Hackathons</NavLink>
          
          {/* Search Box */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                if (!isSearchOpen) {
                  setTimeout(() => inputRef.current?.focus(), 100)
                }
              }}
              className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all text-sm text-slate-400 hover:text-slate-200 min-w-[120px] lg:min-w-[180px]"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline text-xs lg:text-sm">Search hackathons...</span>
                <span className="sm:hidden text-xs">Search</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded border border-white/20">
                ⌘K
              </kbd>
            </button>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search hackathons, teams, projects..."
                      className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <span className="text-lg">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {suggestion.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Press Enter to search</span>
                    <button
                      onClick={() => navigate('/search')}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Advanced Search →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <NavLink to="/community" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Community</NavLink>
          {user && user.role !== 'mentor' && (
            <>
              <NavLink to="/teams" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Teams</NavLink>
              <NavLink to="/gallery" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Gallery</NavLink>
              <NavLink to="/gamify" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Gamify</NavLink>
              <NavLink to="/quest-map" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Quest Map</NavLink>
            </>
          )}
          {user ? (
            <>
              <NavLink to="/dashboard" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Dashboard</NavLink>
              <NotificationBell />
              <button onClick={logout} className="btn-primary bg-white/10 hover:bg-white/20">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Login</NavLink>
              <NavLink to="/signup" className={({isActive}) => `text-sm ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`}>Sign up</NavLink>
            </>
          )}
          <button aria-label="Toggle theme" onClick={toggle} className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={() => navigate('/search')}
            className="flex items-center gap-1 px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-slate-200"
          >
            <Search className="h-4 w-4"/>
            <span className="text-xs">Search</span>
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="btn-primary">Dashboard</Link>
              <button onClick={logout} className="btn-primary bg-white/10 hover:bg-white/20">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary"><LogIn className="h-4 w-4"/> Login</Link>
              <Link to="/signup" className="btn-primary"><UserPlus className="h-4 w-4"/> Sign up</Link>
            </>
          )}
          <button aria-label="Toggle theme" onClick={toggle} className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}

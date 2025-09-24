import React, { useState, useEffect, createContext, useContext } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'participant' | 'organizer' | 'judge'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return mock data for development
    return {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'participant' as const,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      },
      login: async () => {},
      logout: () => {},
      signup: async () => {},
      isLoading: false
    }
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check for stored auth token and validate
    const token = localStorage.getItem('auth_token')
    if (token) {
      // In a real app, validate token with backend
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'participant',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - in real app, call your auth API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'participant',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      }
      
      setUser(mockUser)
      localStorage.setItem('auth_token', 'mock_token_123')
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  const signup = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true)
    try {
      // Mock signup - in real app, call your auth API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar
      }
      
      setUser(newUser)
      localStorage.setItem('auth_token', 'mock_token_123')
    } catch (error) {
      throw new Error('Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

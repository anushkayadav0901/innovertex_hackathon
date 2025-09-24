import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Paperclip, MoreVertical } from 'lucide-react'
import { useStore } from '@/store/useStore'
import EmojiPicker from './EmojiPicker'

interface Message {
  id: string
  userId: string
  content: string
  timestamp: Date
  type: 'text' | 'emoji' | 'image'
  reactions?: { emoji: string; users: string[] }[]
}

interface ChatInterfaceProps {
  roomId: string
  title?: string
  height?: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    userId: '1',
    content: 'Hey everyone! Excited to work on this hackathon together! 🚀',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text',
    reactions: [
      { emoji: '❤️', users: ['2', '3'] },
      { emoji: '🚀', users: ['2'] }
    ]
  },
  {
    id: '2',
    userId: '2',
    content: 'Same here! I\'ve been working on the frontend. The design is looking great!',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text',
    reactions: [
      { emoji: '👍', users: ['1', '3'] }
    ]
  },
  {
    id: '3',
    userId: '3',
    content: 'Perfect! I just finished the API endpoints. Ready to integrate! 💪',
    timestamp: new Date(Date.now() - 1800000),
    type: 'text'
  }
]

export default function ChatInterface({ roomId, title = 'Team Chat', height = '500px' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const currentUserId = useStore(s => s.session.currentUserId) || '1'
  const users = useStore(s => s.users)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Simulate typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const otherUsers = Object.keys(users).filter(id => id !== currentUserId)
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)]
      
      if (randomUser && Math.random() > 0.9) {
        setIsTyping(prev => [...prev, randomUser])
        setTimeout(() => {
          setIsTyping(prev => prev.filter(id => id !== randomUser))
          // Sometimes add a message
          if (Math.random() > 0.7) {
            const responses = [
              'Great work everyone! 👏',
              'I agree with that approach',
              'Let me know if you need any help',
              'Looking good! 🔥',
              'Should we schedule a quick sync?'
            ]
            const newMsg: Message = {
              id: Date.now().toString(),
              userId: randomUser,
              content: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date(),
              type: 'text'
            }
            setMessages(prev => [...prev, newMsg])
          }
        }, 2000 + Math.random() * 3000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [users, currentUserId])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || []
        const existingReaction = reactions.find(r => r.emoji === emoji)
        
        if (existingReaction) {
          if (existingReaction.users.includes(currentUserId)) {
            // Remove reaction
            existingReaction.users = existingReaction.users.filter(id => id !== currentUserId)
            if (existingReaction.users.length === 0) {
              return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) }
            }
          } else {
            // Add reaction
            existingReaction.users.push(currentUserId)
          }
        } else {
          // New reaction
          reactions.push({ emoji, users: [currentUserId] })
        }
        
        return { ...msg, reactions }
      }
      return msg
    }))
  }

  const getUserById = (id: string) => users[id] || { name: 'Unknown User', avatar: '' }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden flex flex-col" style={{ height }}>
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {Object.values(users).slice(0, 3).map(user => (
              <div key={user.id} className="online-indicator">
                <img
                  src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white/20 object-cover"
                />
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400">{Object.keys(users).length} members online</p>
          </div>
        </div>
        
        <motion.button
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MoreVertical className="w-4 h-4 text-slate-300" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => {
            const user = getUserById(message.userId)
            const isCurrentUser = message.userId === currentUserId
            
            return (
              <motion.div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {!isCurrentUser && (
                  <div className="online-indicator">
                    <img
                      src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  </div>
                )}
                
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  {!isCurrentUser && (
                    <span className="text-xs text-slate-400 mb-1 px-3">{user.name}</span>
                  )}
                  
                  <div className={`message-bubble px-4 py-2 rounded-2xl ${
                    isCurrentUser ? 'sent' : 'received'
                  }`}>
                    <p className="text-sm text-white">{message.content}</p>
                  </div>
                  
                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {message.reactions.map((reaction) => (
                        <motion.button
                          key={reaction.emoji}
                          onClick={() => addReaction(message.id, reaction.emoji)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                            reaction.users.includes(currentUserId)
                              ? 'bg-brand-500/20 border border-brand-500/30'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-slate-300">{reaction.users.length}</span>
                        </motion.button>
                      ))}
                      <motion.button
                        onClick={() => addReaction(message.id, '❤️')}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>
                  )}
                  
                  <span className="text-xs text-slate-500 mt-1 px-3">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing Indicators */}
        <AnimatePresence>
          {isTyping.map(userId => {
            const user = getUserById(userId)
            return (
              <motion.div
                key={userId}
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <img
                  src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 relative">
        <div className="flex items-center gap-3">
          <motion.button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Paperclip className="w-4 h-4 text-slate-400" />
          </motion.button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-brand-400 transition-colors"
            />
            <motion.button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Smile className="w-4 h-4 text-slate-400" />
            </motion.button>
          </div>
          
          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim()
                ? 'bg-brand-500 hover:bg-brand-600 text-white'
                : 'bg-white/10 text-slate-400 cursor-not-allowed'
            }`}
            whileHover={newMessage.trim() ? { scale: 1.1 } : {}}
            whileTap={newMessage.trim() ? { scale: 0.9 } : {}}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Emoji Picker */}
        <EmojiPicker
          isOpen={showEmojiPicker}
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      </div>
    </div>
  )
}

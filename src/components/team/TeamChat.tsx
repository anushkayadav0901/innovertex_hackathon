import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react'
import { TeamMember } from './TeamFormation'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
}

interface TeamChatProps {
  team: TeamMember[]
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey everyone! Excited to work on this project together 🚀',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text'
  },
  {
    id: '2',
    senderId: '2',
    content: 'Same here! I\'ve been thinking about the UI design. Should we start with wireframes?',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text'
  },
  {
    id: '3',
    senderId: '3',
    content: 'Great idea! I can help with the data modeling and API design once we have the wireframes.',
    timestamp: new Date(Date.now() - 2400000),
    type: 'text'
  },
  {
    id: '4',
    senderId: '4',
    content: 'Perfect! Let\'s schedule a quick call to align on the product requirements first.',
    timestamp: new Date(Date.now() - 1800000),
    type: 'text'
  }
]

export default function TeamChat({ team }: TeamChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [currentUserId] = useState('1') // Mock current user
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Simulate typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMember = team[Math.floor(Math.random() * team.length)]
      if (randomMember && randomMember.id !== currentUserId && Math.random() > 0.8) {
        setIsTyping(prev => [...prev, randomMember.id])
        setTimeout(() => {
          setIsTyping(prev => prev.filter(id => id !== randomMember.id))
          // Sometimes add a message
          if (Math.random() > 0.7) {
            const responses = [
              'Sounds good to me!',
              'I agree with that approach',
              'Let me know if you need any help',
              'Great progress everyone!',
              'Should we set up a meeting?'
            ]
            const newMsg: Message = {
              id: Date.now().toString(),
              senderId: randomMember.id,
              content: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date(),
              type: 'text'
            }
            setMessages(prev => [...prev, newMsg])
          }
        }, 2000 + Math.random() * 3000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [team, currentUserId])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
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

  const getMemberById = (id: string) => team.find(member => member.id === id)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (team.length === 0) {
    return (
      <div className="glassmorphism rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-white mb-2">Team Chat</h3>
        <p className="text-slate-400">Add team members to start chatting</p>
      </div>
    )
  }

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {team.slice(0, 3).map(member => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white/20 object-cover"
              />
            ))}
            {team.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-brand-500 border-2 border-white/20 flex items-center justify-center text-xs font-bold text-white">
                +{team.length - 3}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">Team Chat</h3>
            <p className="text-xs text-slate-400">{team.length} members</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Phone className="w-4 h-4 text-slate-300" />
          </motion.button>
          <motion.button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Video className="w-4 h-4 text-slate-300" />
          </motion.button>
          <motion.button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-4 h-4 text-slate-300" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => {
            const member = getMemberById(message.senderId)
            const isCurrentUser = message.senderId === currentUserId
            
            return (
              <motion.div
                key={message.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {!isCurrentUser && member && (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  {!isCurrentUser && member && (
                    <span className="text-xs text-slate-400 mb-1 px-3">{member.name}</span>
                  )}
                  
                  <motion.div
                    className={`chat-bubble px-4 py-2 rounded-2xl max-w-xs lg:max-w-md ${
                      isCurrentUser
                        ? 'bg-brand-500 text-white sent'
                        : 'bg-white/10 text-white received'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-sm">{message.content}</p>
                  </motion.div>
                  
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
            const member = getMemberById(userId)
            if (!member) return null
            
            return (
              <motion.div
                key={userId}
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-white/10 rounded-2xl px-4 py-2 flex items-center gap-1">
                  <span className="text-xs text-slate-400 mr-2">{member.name} is typing</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full typing-dot" />
                    <div className="w-1 h-1 bg-slate-400 rounded-full typing-dot" />
                    <div className="w-1 h-1 bg-slate-400 rounded-full typing-dot" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10">
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
      </div>
    </div>
  )
}

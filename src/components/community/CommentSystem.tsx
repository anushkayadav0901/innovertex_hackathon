import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ChevronDown, ChevronRight, Reply, MoreHorizontal } from 'lucide-react'
import { useStore } from '@/store/useStore'
import LikeButton from './LikeButton'

interface Comment {
  id: string
  userId: string
  content: string
  timestamp: Date
  likes: number
  replies?: Comment[]
  parentId?: string
}

interface CommentSystemProps {
  postId: string
  initialComments?: Comment[]
}

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    content: 'This is an amazing project! The UI looks fantastic and the functionality is spot on. Great work team! 🚀',
    timestamp: new Date(Date.now() - 3600000),
    likes: 12,
    replies: [
      {
        id: '1-1',
        userId: '2',
        content: 'Thank you! We put a lot of effort into the design. Really appreciate the feedback! 😊',
        timestamp: new Date(Date.now() - 3000000),
        likes: 5,
        parentId: '1'
      },
      {
        id: '1-2',
        userId: '3',
        content: 'Agreed! The animations are so smooth. How did you implement the micro-interactions?',
        timestamp: new Date(Date.now() - 2400000),
        likes: 3,
        parentId: '1'
      }
    ]
  },
  {
    id: '2',
    userId: '4',
    content: 'Love the color scheme and the overall user experience. This could definitely win the hackathon! 🏆',
    timestamp: new Date(Date.now() - 1800000),
    likes: 8,
    replies: [
      {
        id: '2-1',
        userId: '1',
        content: 'Thanks for the encouragement! We\'re really excited about the final presentation.',
        timestamp: new Date(Date.now() - 1200000),
        likes: 2,
        parentId: '2'
      }
    ]
  },
  {
    id: '3',
    userId: '5',
    content: 'Quick question - is the source code available? I\'d love to learn from your implementation approach.',
    timestamp: new Date(Date.now() - 900000),
    likes: 6
  }
]

export default function CommentSystem({ postId, initialComments = mockComments }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set(['1', '2']))
  
  const currentUserId = useStore(s => s.session.currentUserId) || '1'
  const users = useStore(s => s.users)

  const getUserById = (id: string) => users[id] || { 
    name: 'Unknown User', 
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40`,
    role: 'participant'
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUserId,
      content: newComment,
      timestamp: new Date(),
      likes: 0
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      userId: currentUserId,
      content: replyText,
      timestamp: new Date(),
      likes: 0,
      parentId
    }

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        }
      }
      return comment
    }))

    setReplyText('')
    setReplyingTo(null)
    setExpandedComments(prev => new Set([...prev, parentId]))
  }

  const toggleExpanded = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleLike = (commentId: string, liked: boolean) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: liked ? comment.likes + 1 : Math.max(0, comment.likes - 1) }
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? { ...reply, likes: liked ? reply.likes + 1 : Math.max(0, reply.likes - 1) }
              : reply
          )
        }
      }
      return comment
    }))
  }

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="flex gap-3">
          <img
            src={getUserById(currentUserId).avatar}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-brand-400 transition-colors"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <motion.button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  newComment.trim()
                    ? 'bg-brand-500 hover:bg-brand-600 text-white'
                    : 'bg-white/10 text-slate-400 cursor-not-allowed'
                }`}
                whileHover={newComment.trim() ? { scale: 1.02 } : {}}
                whileTap={newComment.trim() ? { scale: 0.98 } : {}}
              >
                Comment
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => {
            const user = getUserById(comment.userId)
            const isExpanded = expandedComments.has(comment.id)
            const hasReplies = comment.replies && comment.replies.length > 0

            return (
              <motion.div
                key={comment.id}
                className="glassmorphism rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{user.name}</span>
                      <span className="text-xs px-2 py-1 bg-brand-500/20 text-brand-200 rounded-full">
                        {user.role}
                      </span>
                      <span className="text-sm text-slate-400">{formatTime(comment.timestamp)}</span>
                    </div>
                    
                    <p className="text-slate-300 mb-3 leading-relaxed">{comment.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <LikeButton
                        likeCount={comment.likes}
                        onLike={(liked) => handleLike(comment.id, liked)}
                        size="sm"
                      />
                      
                      <motion.button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Reply className="w-4 h-4" />
                        Reply
                      </motion.button>
                      
                      {hasReplies && (
                        <motion.button
                          onClick={() => toggleExpanded(comment.id)}
                          className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          {comment.replies?.length} {comment.replies?.length === 1 ? 'reply' : 'replies'}
                        </motion.button>
                      )}
                      
                      <motion.button
                        className="ml-auto p-1 text-slate-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    {/* Reply Input */}
                    <AnimatePresence>
                      {replyingTo === comment.id && (
                        <motion.div
                          className="mt-4 pl-4 border-l-2 border-brand-500/30"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex gap-3">
                            <img
                              src={getUserById(currentUserId).avatar}
                              alt="Your avatar"
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to ${user.name}...`}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-brand-400 transition-colors text-sm"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => setReplyingTo(null)}
                                  className="px-3 py-1 text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                                <motion.button
                                  onClick={() => handleAddReply(comment.id)}
                                  disabled={!replyText.trim()}
                                  className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                                    replyText.trim()
                                      ? 'bg-brand-500 hover:bg-brand-600 text-white'
                                      : 'bg-white/10 text-slate-400 cursor-not-allowed'
                                  }`}
                                  whileHover={replyText.trim() ? { scale: 1.02 } : {}}
                                  whileTap={replyText.trim() ? { scale: 0.98 } : {}}
                                >
                                  Reply
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Replies */}
                    <AnimatePresence>
                      {hasReplies && (
                        <motion.div
                          className={`comment-replies mt-4 pl-4 border-l-2 border-white/10 space-y-3 ${
                            isExpanded ? 'expanded' : 'collapsed'
                          }`}
                          initial={{ opacity: 0, maxHeight: 0 }}
                          animate={{ 
                            opacity: isExpanded ? 1 : 0, 
                            maxHeight: isExpanded ? 1000 : 0 
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {comment.replies?.map((reply) => {
                            const replyUser = getUserById(reply.userId)
                            return (
                              <motion.div
                                key={reply.id}
                                className="flex gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <img
                                  src={replyUser.avatar}
                                  alt={replyUser.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white text-sm">{replyUser.name}</span>
                                    <span className="text-xs px-2 py-0.5 bg-brand-500/20 text-brand-200 rounded-full">
                                      {replyUser.role}
                                    </span>
                                    <span className="text-xs text-slate-400">{formatTime(reply.timestamp)}</span>
                                  </div>
                                  <p className="text-slate-300 text-sm mb-2 leading-relaxed">{reply.content}</p>
                                  <div className="flex items-center gap-3">
                                    <LikeButton
                                      likeCount={reply.likes}
                                      onLike={(liked) => handleLike(reply.id, liked)}
                                      size="sm"
                                    />
                                    <button className="text-xs text-slate-400 hover:text-white transition-colors">
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

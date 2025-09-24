import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: Date
  type: 'hackathon' | 'deadline' | 'meeting' | 'workshop'
  color: string
}

interface CalendarWidgetProps {
  events?: Event[]
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI Hackathon Starts',
    date: new Date(2024, 11, 15),
    type: 'hackathon',
    color: '#3b5cff'
  },
  {
    id: '2',
    title: 'Submission Deadline',
    date: new Date(2024, 11, 17),
    type: 'deadline',
    color: '#ff6b6b'
  },
  {
    id: '3',
    title: 'Team Formation Workshop',
    date: new Date(2024, 11, 20),
    type: 'workshop',
    color: '#4ecdc4'
  },
  {
    id: '4',
    title: 'Judging Session',
    date: new Date(2024, 11, 22),
    type: 'meeting',
    color: '#ffe66d'
  }
]

export default function CalendarWidget({ events = mockEvents }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const hasEvent = (date: Date | null) => {
    if (!date) return false
    return events.some(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(currentDate)
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="glassmorphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-400" />
          Calendar
        </h3>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4 text-slate-300" />
          </motion.button>
          <span className="text-white font-medium min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <motion.button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </motion.button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        <AnimatePresence mode="wait">
          {days.map((date, index) => (
            <motion.div
              key={`${currentDate.getMonth()}-${index}`}
              className={`calendar-day relative h-10 flex items-center justify-center text-sm rounded-lg ${
                date ? 'cursor-pointer' : ''
              } ${
                isToday(date) ? 'bg-brand-500 text-white font-bold' : 
                isSelected(date) ? 'selected' :
                hasEvent(date) ? 'has-event text-white' : 
                date ? 'text-slate-300' : 'text-slate-600'
              }`}
              onClick={() => date && setSelectedDate(date)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              whileHover={date ? { scale: 1.1 } : {}}
              whileTap={date ? { scale: 0.95 } : {}}
            >
              {date?.getDate()}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected date events */}
      <AnimatePresence>
        {selectedDate && selectedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-white">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="space-y-2">
              {selectedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {event.title}
                    </div>
                    <div className="text-xs text-slate-400 capitalize">
                      {event.type}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-slate-400">Hackathons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-400">Deadlines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-slate-400">Workshops</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-slate-400">Meetings</span>
          </div>
        </div>
      </div>
    </div>
  )
}

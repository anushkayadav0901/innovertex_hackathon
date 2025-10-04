import React, { useMemo, useState } from 'react'
import { useStore } from '@/store/useStore'
import { motion } from 'framer-motion'
import { BarChart3, Users, Trophy, Calendar, TrendingUp, Award, Target } from 'lucide-react'
import AnimatedCounter from '@/components/dashboard/AnimatedCounter'
import DonutChart from '@/components/dashboard/DonutChart'
import LineChart from '@/components/dashboard/LineChart'
import ProgressRing from '@/components/dashboard/ProgressRing'
import CalendarWidget from '@/components/dashboard/CalendarWidget'
import NotificationCards from '@/components/dashboard/NotificationCards'
// generic dashboard view; role-specific components not routed here

export default function Dashboard() {
  const currentUserId = useStore(s => s.session.currentUserId)
  const user = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const teams = useStore(s => s.teams)
  const hackathons = useStore(s => s.hackathons)
  const foodWindows = useStore(s => s.foodWindows)
  const foodRedemptions = useStore(s => s.foodRedemptions)
  const activateFoodWindow = useStore(s => s.activateFoodWindow)
  const endFoodWindow = useStore(s => s.endFoodWindow)
  const getParticipantFoodToken = useStore(s => s.getParticipantFoodToken)
  

  // Show the same dashboard for all roles; organizer card below adds controls

  // Organizer controls: show all hackathons to simplify managing coupons
  const myOrganized = useMemo(() => Object.values(hackathons), [hackathons])
  const [durationByHx, setDurationByHx] = useState<Record<string, number>>({})

  // Participant coupon sections
  const myTeams = useMemo(() => Object.values(teams).filter(t => t.members.includes(currentUserId || '')), [teams, currentUserId])

  const stats = [
    { 
      label: 'Active Hackathons', 
      value: 12, 
      icon: BarChart3, 
      color: 'text-blue-400',
      gradient: 'gradient-bg-1',
      change: '+23%'
    },
    { 
      label: 'Team Members', 
      value: 4, 
      icon: Users, 
      color: 'text-green-400',
      gradient: 'gradient-bg-2',
      change: '+12%'
    },
    { 
      label: 'Submissions', 
      value: 8, 
      icon: Trophy, 
      color: 'text-purple-400',
      gradient: 'gradient-bg-3',
      change: '+45%'
    },
    { 
      label: 'Events This Month', 
      value: 3, 
      icon: Calendar, 
      color: 'text-orange-400',
      gradient: 'gradient-bg-4',
      change: '+8%'
    },
  ]

  const participationData = {
    labels: ['Completed', 'In Progress', 'Upcoming', 'Cancelled'],
    values: [45, 25, 20, 10],
    colors: ['#3b5cff', '#4ecdc4', '#ffe66d', '#ff6b6b']
  }

  const submissionTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Submissions',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#3b5cff',
        backgroundColor: 'rgba(59, 92, 255, 0.1)'
      },
      {
        label: 'Wins',
        data: [2, 4, 3, 6, 5, 8],
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)'
      }
    ]
  }

  const progressData = [
    { label: 'Profile Completion', progress: 85, color: '#3b5cff' },
    { label: 'Skills Assessment', progress: 72, color: '#4ecdc4' },
    { label: 'Team Building', progress: 90, color: '#ffe66d' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-brand-200 to-purple-200 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Here's what's happening with your hackathons</p>
      </motion.div>

      {/* Organizer: Food Coupon Controls */}
      {user?.role === 'organizer' && myOrganized.length > 0 && (
        <motion.div
          className="dashboard-card glassmorphism rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-4">Food Coupons</h3>
          <div className="space-y-4">
            {myOrganized.map(hx => {
              const win = foodWindows[hx.id]
              const now = Date.now()
              const active = !!win && now >= win.startAt && now <= win.endAt
              const remainingMs = active ? (win.endAt - now) : 0
              const remainingH = Math.floor(remainingMs / (60 * 60 * 1000))
              const remainingM = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000))
              return (
                <div key={hx.id} className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{hx.title}</div>
                      {active ? (
                        <div className="text-sm text-green-400">Active • Ends in {remainingH}h {remainingM}m</div>
                      ) : (
                        <div className="text-sm text-slate-400">Inactive</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!active && (
                        <>
                          <input
                            type="number"
                            min={1}
                            placeholder="Hours"
                            className="input w-28"
                            value={durationByHx[hx.id] ?? ''}
                            onChange={e => setDurationByHx(s => ({ ...s, [hx.id]: Number(e.target.value) }))}
                          />
                          <button
                            className="btn-primary"
                            onClick={() => activateFoodWindow(hx.id, durationByHx[hx.id] || 1)}
                          >
                            Activate
                          </button>
                        </>
                      )}
                      {active && (
                        <button
                          className="btn-primary bg-red-500/20 hover:bg-red-500/30"
                          onClick={() => endFoodWindow(hx.id)}
                        >
                          End
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}


      {/* Participant: My Food Coupon (QR) */}
      {myTeams.map(team => {
        const hx = hackathons[team.hackathonId]
        const win = foodWindows[team.hackathonId]
        const now = Date.now()
        const active = !!win && now >= (win?.startAt || 0) && now <= (win?.endAt || 0)
        // compute progress for the team
        const teamTotal = team.members.length
        const teamRedeemed = Object.values(foodRedemptions).filter(r => r.teamId === team.id && r.redeemedAt).length
        const hide = teamTotal > 0 && teamRedeemed >= teamTotal
        if (!active || hide) return null
        const token = currentUserId ? getParticipantFoodToken(team.hackathonId, currentUserId) : undefined
        const scanUrl = typeof window !== 'undefined' ? `${window.location.origin}/food-scan?token=${encodeURIComponent(token || '')}` : `/food-scan?token=${encodeURIComponent(token || '')}`
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(scanUrl)}`
        return (
          <motion.div
            key={`food-${team.id}`}
            className="dashboard-card glassmorphism rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div>
                <img src={qrUrl} alt="Food QR" className="w-[220px] h-[220px] rounded-lg bg-white/10 p-2" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Food Coupon Active</h3>
                <div className="text-sm text-slate-300 mb-2">Hackathon: {hx?.title} • Team: {team.name}</div>
                <div className="text-sm text-blue-300 mb-3">Redemption: {teamRedeemed}/{teamTotal}</div>
                <div className="text-xs text-slate-400 mb-4">Show this QR at the food counter. It can be scanned once per member.</div>
                <a href={scanUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">Open Scan Link</a>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

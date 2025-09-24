import React, { useState } from 'react'
import ProgressStages from '@/components/gamify/ProgressStages'
import Badges from '@/components/gamify/Badges'
import AnimatedLeaderboard from '@/components/gamify/AnimatedLeaderboard'
import ParticleCelebration from '@/components/gamify/ParticleCelebration'
import StatCards from '@/components/gamify/StatCards'
import StreakCounter from '@/components/gamify/StreakCounter'
import BadgeGrid from '@/components/gamify/BadgeGrid'
import ParallaxOrbs from '@/components/gamify/ParallaxOrbs'

export default function Gamify() {
  const [trigger, setTrigger] = useState(0)

  return (
    <div className="relative space-y-6">
      <ParallaxOrbs />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <StatCards
            stats={[
              { id: 'pts', label: 'Total Points', value: 1240, sub: '+120 this week', progress: 0.62 },
              { id: 'rank', label: 'Current Rank', value: '#12', sub: 'Top 10%' },
              { id: 'badges', label: 'Badges', value: 18, sub: '3 new this month' },
            ]}
          />
          <ProgressStages
            stages={[
              { name: 'Registration', percent: 100 },
              { name: 'Team Formation', percent: 100 },
              { name: 'Prototype', percent: 65 },
              { name: 'Submission', percent: 10 },
            ]}
          />
          <StreakCounter days={7} />
          <div className="card p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3>Milestone Celebration</h3>
              <button className="btn-primary" onClick={() => setTrigger(t => t + 1)}>Celebrate</button>
            </div>
            <ParticleCelebration trigger={trigger} />
          </div>
        </div>
        <div className="space-y-6">
          <AnimatedLeaderboard
            rows={[
              { id: '1', name: 'Team Phoenix', score: 980 },
              { id: '2', name: 'Code Ninjas', score: 860 },
              { id: '3', name: 'Quantum Cats', score: 920 },
              { id: '4', name: 'Neural Knights', score: 870 },
            ]}
          />
          <Badges badges={[
            { id: 'b1', label: 'First Commit', rarity: 'common' },
            { id: 'b2', label: 'Prototype Ready', rarity: 'rare' },
            { id: 'b3', label: 'Early Bird', rarity: 'epic' },
            { id: 'b4', label: 'Team Player', rarity: 'legendary' },
          ]} />
        </div>
      </div>

      <BadgeGrid badges={[
        { id: 'g1', label: 'Bug Basher', emoji: '🪲' },
        { id: 'g2', label: 'Pixel Perfect', emoji: '🎨' },
        { id: 'g3', label: 'Pitch Pro', emoji: '🎤' },
        { id: 'g4', label: 'Speed Runner', emoji: '⚡' },
        { id: 'g5', label: 'Data Diver', emoji: '📊' },
        { id: 'g6', label: 'Cloud Rider', emoji: '☁️' },
        { id: 'g7', label: 'AI Whisperer', emoji: '🤖' },
        { id: 'g8', label: 'Security Sage', emoji: '🔐' },
        { id: 'g9', label: 'Open Sourcerer', emoji: '🧙' },
        { id: 'g10', label: 'API Alchemist', emoji: '⚗️' },
        { id: 'g11', label: 'Doc Dynamo', emoji: '📚' },
        { id: 'g12', label: 'UX Unicorn', emoji: '🦄' },
      ]} />
    </div>
  )
}
